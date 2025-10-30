import axiosInstance from "@/api/axios";
import { tokenService } from "@/authentication/tokenService";
import { AuthContext } from "@/authentication/context";
import { redirectService } from "@/authentication/redirectService";
import type { AxiosError, User } from "@/authentication/AuthContext.types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { message } from "antd";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    tokenService.getAccessToken()
  );
  const [user, setUser] = useState<User | null>(() =>
    tokenService.getUserData()
  );
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Computed values
  const isAuthenticated = Boolean(accessToken && user);
  const role = user?.role;

  console.log("🔍 User:", user);
  console.log("🔍 Role:", role);
  console.log("🔍 Is Authenticated:", isAuthenticated);

  const login = async (email: string, password: string) => {
    console.log("🔑 Starting login process...");
    const res = await axiosInstance.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    const token = res.data.accessToken;
    const userData = res.data.user;

    // Store token and user data
    tokenService.setAccessToken(token);
    tokenService.setUserData(userData);

    // Update state
    setAccessToken(token);
    setUser(userData);

    console.log("✅ Login successful");
  };

  const registerUser = async (
    schoolId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      await axiosInstance.post("/auth/register", {
        schoolId,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: "clearingOfficer" as const,
      });
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response?.status === 400) {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Registration failed."
        );
      }
      throw error;
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      const currentToken = tokenService.getAccessToken();
      await axiosInstance.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
          headers: currentToken
            ? { Authorization: `Bearer ${currentToken}` }
            : {},
        }
      );
      message.success("Logout successfully!");
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      setLogoutLoading(false);
    }

    // Local cleanup
    tokenService.clearTokens();
    setAccessToken(null);
    setUser(null);

    redirectService.redirectToLogin(
      "You have been logged out successfully.",
      false
    );
    // Note: setLogoutLoading(false) not needed as user will be redirected
  };

  /**
   * Updates the user data in both state and localStorage
   */
  const updateUser = (userData: User) => {
    tokenService.setUserData(userData);
    setUser(userData);
  };

  /**
   * Attempts to refresh the access token using the token service.
   */
  const refreshAccessToken = async (): Promise<string> => {
    try {
      const newToken = await tokenService.refreshAccessToken();
      setAccessToken(newToken);
      return newToken;
    } catch (err: unknown) {
      // Token service handles cleanup and redirect
      setAccessToken(null);
      setUser(null);
      throw err;
    }
  };

  /**
   * On mount, try to refresh token if user data exists but no valid access token.
   */
  useEffect(() => {
    const tryInitialRefresh = async () => {
      const storedToken = tokenService.getAccessToken();
      const storedUser = tokenService.getUserData();

      // If we have user data but no valid token, try to refresh
      if (
        storedUser &&
        (!storedToken || tokenService.isTokenExpired(storedToken))
      ) {
        console.log("🔄 Attempting initial token refresh...");
        try {
          await refreshAccessToken();
        } catch {
          console.log("❌ Initial refresh failed - clearing data");
          tokenService.clearTokens();
          setAccessToken(null);
          setUser(null);
        }
      }

      // Mark initialization as complete
      setIsInitialized(true);
    };
    tryInitialRefresh();
  }, []);

  /**
   * Set up axios interceptors for request and response.
   * Handles automatic token refresh and logout on refresh token expiry.
   */
  useEffect(() => {
    console.log("🔧 Setting up axios interceptors");

    const requestIntercept = axiosInstance.interceptors.request.use(
      async (config) => {
        const currentToken = tokenService.getAccessToken();

        // Skip auth endpoints
        if (config.url?.includes("/auth/")) {
          return config;
        }

        // Check if token is expired before making request
        if (currentToken && tokenService.isTokenExpired(currentToken)) {
          console.log("⏰ Token expired - refreshing before request");
          try {
            const newToken = await refreshAccessToken();
            config.headers.Authorization = `Bearer ${newToken}`;
          } catch {
            // Refresh failed, request will fail with 401/403
            console.error("❌ Pre-request token refresh failed");
          }
        } else if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh for auth endpoints
        if (originalRequest?.url?.includes("/auth/")) {
          return Promise.reject(error);
        }

        // If access token expired or invalid, try to refresh
        // Handle both 401 (Unauthorized) and 403 (Forbidden) for token expiry
        const isAuthError =
          error.response?.status === 401 || error.response?.status === 403;
        if (isAuthError && !originalRequest._retry) {
          console.log(
            `🚨 ${error.response?.status} - Attempting token refresh`
          );
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError: unknown) {
            // Token service handles cleanup and redirect
            setAccessToken(null);
            setUser(null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        role,
        isAuthenticated,
        isInitialized,
        login,
        registerUser,
        logout,
        loading,
        setLoading,
        logoutLoading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
