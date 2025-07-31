// import axiosInstance from "@/api/axios";
// import React, { createContext, useContext, useEffect, useState } from "react";

// // Context type
// interface AuthContextType {
//   accessToken: string | null;
//   role?: string;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// // Create Context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Provider
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [role, setRole] = useState<string | undefined>(undefined);

//   // Login
//   const login = async (email: string, password: string) => {
//     const res = await axiosInstance.post("/auth/login", { email, password });
//     setAccessToken(res.data.accessToken); // Store in memory
//     setRole(res.data.user.role); // Set role if available
//     console.log("Login successful, role:", res.data.role);
//     console.log("Access Token:", res.data.accessToken);
//     console.log("User Role:", res);
//   };

//   // Logout
//   const logout = async () => {
//     await axiosInstance.post("/auth/logout");
//     setAccessToken(null);
//   };

//   // Refresh token on mount
//   const refreshAccessToken = async () => {
//     try {
//       const res = await axiosInstance.post("/auth/refresh-token");
//       setAccessToken(res.data.accessToken);
//     } catch (err) {
//       setAccessToken(null);
//     }
//   };

//   useEffect(() => {
//     refreshAccessToken(); // run once when app loads
//   }, []);

//   // Auto-attach token to requests
//   useEffect(() => {
//     const requestIntercept = axiosInstance.interceptors.request.use(
//       (config) => {
//         if (accessToken) {
//           config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//       }
//     );

//     return () => axiosInstance.interceptors.request.eject(requestIntercept);
//   }, [accessToken]);

//   console.log("AuthProvider initialized with accessToken:", accessToken);

//   return (
//     <AuthContext.Provider value={{ accessToken, login, logout, role }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

import axiosInstance from "@/api/axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Context type
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
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken") || null
  );
  const [role, setRole] = useState<string | undefined>(
    () => localStorage.getItem("role") || undefined
  );

  // Login
  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const token = res.data.accessToken;
    const userRole = res.data.user?.role;

    setAccessToken(token);
    setRole(userRole);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);

    console.log("Access Token:", token);

    console.log("Login successful, role:", userRole);
  };

  // Register
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
      const { status } = err.response || {};
      if (status === 400) {
        toast.error(err?.response?.data?.message || "Registration failed.");
      }
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setAccessToken(null);
    setRole(undefined);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
  };

  // Refresh token on mount
  const refreshAccessToken = async () => {
    try {
      const res = await axiosInstance.post("/auth/refresh-token");
      const token = res.data.accessToken;
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    } catch (err) {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  // Auto-attach token to requests interceptors
  useEffect(() => {
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // ⛔ Don't retry on login or register failure
        if (
          originalRequest.url.includes("/auth/login") ||
          originalRequest.url.includes("/auth/register")
        ) {
          return Promise.reject(error);
        }

        // Prevent infinite retry loop
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const res = await axios.post(
              "/auth/refresh-token",
              {},
              { withCredentials: true }
            );

            const newAccessToken = res.data.accessToken;
            setAccessToken(newAccessToken);
            localStorage.setItem("accessToken", newAccessToken);

            // Set new token in header and retry request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            await logout();
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
            window.location.reload();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axiosInstance.interceptors.response.eject(responseIntercept);
  }, [accessToken]);

  console.log("AuthProvider initialized with accessToken:", accessToken);

  return (
    <AuthContext.Provider
      value={{ accessToken, login, registerUser, logout, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
