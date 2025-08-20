import axiosInstance from "@/api/axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * AuthContextType defines the shape of the authentication context.
 */
interface AuthContextType {
  accessToken: string | null;
  role?: string;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (
    studentId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let refreshPromise: Promise<string> | null = null;

/**
 * AuthProvider manages authentication state and logic.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken") || null
  );
  const [role, setRole] = useState<string | undefined>(
    () => localStorage.getItem("role") || undefined
  );
  const [loading, setLoading] = useState(false);

  /**
   * Handles user login.
   */
  const login = async (email: string, password: string) => {
    console.log("🔑 Starting login process...");
    const res = await axiosInstance.post("/auth/login", { email, password });
    const token = res.data.accessToken;
    const userRole = res.data.user?.role;

    setAccessToken(token);
    setRole(userRole);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);

    console.log("✅ Login successful");
  };

  /**
   * Handles user registration.
   */
  const registerUser = async (
    studentId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      await axiosInstance.post("/auth/register", {
        studentId,
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: "clearingOfficer" as const,
      });
    } catch (err: any) {
      if (err.response?.status === 400) {
        toast.error(err?.response?.data?.message || "Registration failed.");
      }
      throw err;
    }
  };

  /**
   * Logs out the user, clears all local storage, and redirects to login.
   */
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed on server:", error);
    }

    refreshPromise = null;
    setAccessToken(null);
    setRole(undefined);
    localStorage.clear();

    // Force redirect to login page
    window.location.href = "/login";
  };

  /**
   * Attempts to refresh the access token.
   * If the refresh token is expired or invalid, logs out and clears all local storage.
   */
  const refreshAccessToken = async (): Promise<string> => {
    try {
      console.log("🔄 Attempting token refresh...");
      const res = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );

      const newToken = res.data.accessToken;
      const newRole = res.data.user?.role;

      setAccessToken(newToken);
      localStorage.setItem("accessToken", newToken);

      if (newRole) {
        setRole(newRole);
        localStorage.setItem("role", newRole);
      }

      console.log("✅ Token refresh successful!");
      return newToken;
    } catch (err: any) {
      // If refresh token is expired or invalid, clear all local storage and force logout
      console.log(
        "❌ Token refresh failed - logging out and clearing local storage"
      );
      refreshPromise = null;
      setAccessToken(null);
      setRole(undefined);
      localStorage.clear();
      window.location.href = "/login";
      throw err;
    }
  };

  /**
   * On mount, try to refresh token if a token or role exists in local storage.
   */
  useEffect(() => {
    const tryInitialRefresh = async () => {
      const storedToken = localStorage.getItem("accessToken");
      const storedRole = localStorage.getItem("role");

      if ((storedToken || storedRole) && !accessToken) {
        console.log("🔄 Attempting initial token refresh...");
        try {
          await refreshAccessToken();
        } catch {
          console.log("❌ Initial refresh failed");
        }
      }
    };
    tryInitialRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Set up axios interceptors for request and response.
   * Handles automatic token refresh and logout on refresh token expiry.
   */
  useEffect(() => {
    console.log("🔧 Setting up axios interceptors");

    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem("accessToken");
        if (currentToken && !config.url?.includes("/auth/")) {
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

        // If access token expired, try to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log("🚨 401 - Attempting token refresh");
          originalRequest._retry = true;

          try {
            if (!refreshPromise) {
              refreshPromise = refreshAccessToken();
            }
            const newToken = await refreshPromise;
            refreshPromise = null;

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError: any) {
            // If refresh token is expired or invalid, clear all local storage and force logout
            refreshPromise = null;
            setAccessToken(null);
            setRole(undefined);
            localStorage.clear();
            window.location.href = "/login";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        login,
        registerUser,
        logout,
        role,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
