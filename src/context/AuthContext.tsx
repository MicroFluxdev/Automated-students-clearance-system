// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "../utils/axios";

// type User = {
//   id: string;
//   email: string;
//   // add other user fields as needed
// };

// type AuthContextType = {
//   user: User | null;
//   accessToken: string | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshToken: () => Promise<string | undefined>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Login: get tokens and user from backend
//   const login = async (email: string, password: string) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.post(
//         "/auth/login",
//         { email, password },
//         { withCredentials: true }
//       );
//       setAccessToken(res.data.accessToken);
//       setUser(res.data.user);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Refresh token: get new accessToken using refreshToken (sent via httpOnly cookie)
//   const refreshToken = async () => {
//     try {
//       const res = await axios.post(
//         "/auth/refresh-token",
//         {},
//         { withCredentials: true }
//       );
//       setAccessToken(res.data.accessToken);
//       setUser(res.data.user);
//       return res.data.accessToken;
//     } catch (err) {
//       setAccessToken(null);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Logout: clear tokens and user
//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post("/auth/logout", {}, { withCredentials: true });
//       setAccessToken(null);
//       setUser(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // On mount, try to refresh token (if refreshToken cookie exists)
//   useEffect(() => {
//     refreshToken();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ user, accessToken, isLoading, login, logout, refreshToken }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook for using auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
