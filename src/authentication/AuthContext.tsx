import axiosInstance from "@/api/axios";
import React, { createContext, useContext, useEffect, useState } from "react";
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
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

let refreshPromise: Promise<string> | null = null;

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
  const [loading, setLoading] = useState(false);

  // Login
  const login = async (email: string, password: string) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const token = res.data.accessToken;
    const userRole = res.data.user?.role;
    console.log("Access Tokens:", token);

    setAccessToken(token);
    setRole(userRole);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", userRole);
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
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed on server:", error);
    }
    setAccessToken(null);
    setRole(undefined);
    localStorage.clear();
    window.location.href = "/login";
  };

  // Refresh token on mount
  const refreshAccessToken = async () => {
    try {
      const res = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      const token = res.data.accessToken;
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
    } catch (err) {
      setAccessToken(null);
      localStorage.clear();
    }
  };

  useEffect(() => {
    if (!accessToken) {
      refreshAccessToken();
    }
  }, [accessToken]);

  // Auto-attach token to requests interceptors
  useEffect(() => {
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          originalRequest.url.includes("/auth/login") ||
          originalRequest.url.includes("/auth/register")
        ) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!refreshPromise) {
            refreshPromise = new Promise(async (resolve, reject) => {
              try {
                const res = await axiosInstance.post(
                  "/auth/refresh-token",
                  {},
                  { withCredentials: true }
                );
                const newAccessToken = res.data.accessToken;
                setAccessToken(newAccessToken);
                localStorage.setItem("accessToken", newAccessToken);
                resolve(newAccessToken);
              } catch (refreshError) {
                setAccessToken(null);
                setRole(undefined);
                localStorage.clear();
                toast.error("Session expired. Please log in again.");
                window.location.href = "/login";
                reject(refreshError);
              } finally {
                refreshPromise = null;
              }
            });
          }

          try {
            const newAccessToken = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (e) {
            return Promise.reject(e);
          }
        }

        return Promise.reject(error);
      }
    );

    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseIntercept);
      axiosInstance.interceptors.request.eject(requestIntercept);
    };
  }, [accessToken]);

  console.log("AuthProvider initialized with accessToken:", accessToken);

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

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
// import axiosInstance from "@/api/axios";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";

// interface AuthContextType {
//   accessToken: string | null;
//   role?: string;
//   login: (email: string, password: string) => Promise<void>;
//   registerUser: (
//     studentId: string,
//     firstName: string,
//     lastName: string,
//     email: string,
//     phoneNumber: string,
//     password: string
//   ) => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   setLoading: (loading: boolean) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// let refreshPromise: Promise<string> | null = null;

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [accessToken, setAccessToken] = useState<string | null>(
//     () => localStorage.getItem("accessToken") || null
//   );
//   const [role, setRole] = useState<string | undefined>(
//     () => localStorage.getItem("role") || undefined
//   );
//   const [loading, setLoading] = useState(false);

//   const login = async (email: string, password: string) => {
//     const res = await axiosInstance.post(
//       "/auth/login",
//       { email, password },
//       { withCredentials: true }
//     );
//     const token = res.data.accessToken;
//     const userRole = res.data.user?.role;
//     setAccessToken(token);
//     setRole(userRole);
//     localStorage.setItem("accessToken", token);
//     localStorage.setItem("role", userRole);
//     console.log("Login successful, token:", token);
//   };

//   const registerUser = async (
//     studentId: string,
//     firstName: string,
//     lastName: string,
//     email: string,
//     phoneNumber: string,
//     password: string
//   ) => {
//     try {
//       await axiosInstance.post("/auth/register", {
//         studentId,
//         firstName,
//         lastName,
//         email,
//         phoneNumber,
//         password,
//         role: "clearingOfficer",
//       });
//     } catch (err: any) {
//       const status = err.response?.status;
//       if (status === 400) {
//         toast.error(err?.response?.data?.message || "Registration failed.");
//       }
//       throw err;
//     }
//   };

//   const logout = async () => {
//     try {
//       await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } finally {
//       setAccessToken(null);
//       setRole(undefined);
//       localStorage.clear();
//       window.location.href = "/login";
//     }
//   };

//   const refreshAccessToken = async (): Promise<string> => {
//     const res = await axiosInstance.post(
//       "/auth/refresh-token",
//       {},
//       { withCredentials: true }
//     );
//     const newToken = res.data.accessToken;
//     setAccessToken(newToken);
//     localStorage.setItem("accessToken", newToken);
//     return newToken;
//   };

//   // Refresh on mount
//   useEffect(() => {
//     if (!accessToken) {
//       refreshAccessToken().catch(() => {
//         setAccessToken(null);
//         localStorage.clear();
//       });
//     }
//   }, []);

//   // Interceptors
//   useEffect(() => {
//     const requestInterceptor = axiosInstance.interceptors.request.use(
//       (config) => {
//         if (accessToken) {
//           config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     const responseInterceptor = axiosInstance.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;

//         if (
//           error.response?.status === 401 &&
//           !originalRequest._retry &&
//           !originalRequest.url.includes("/auth/login") &&
//           !originalRequest.url.includes("/auth/register")
//         ) {
//           originalRequest._retry = true;

//           if (!refreshPromise) {
//             refreshPromise = refreshAccessToken().finally(() => {
//               refreshPromise = null;
//             });
//           }

//           try {
//             const newAccessToken = await refreshPromise;
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//             return axiosInstance(originalRequest);
//           } catch (err) {
//             setAccessToken(null);
//             setRole(undefined);
//             localStorage.clear();
//             // toast.error("Session expired. Please log in again.");
//             // window.location.href = "/login";
//             return Promise.reject(err);
//           }
//         }

//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosInstance.interceptors.request.eject(requestInterceptor);
//       axiosInstance.interceptors.response.eject(responseInterceptor);
//     };
//   }, [accessToken]);

//   return (
//     <AuthContext.Provider
//       value={{
//         accessToken,
//         login,
//         registerUser,
//         logout,
//         role,
//         loading,
//         setLoading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };
