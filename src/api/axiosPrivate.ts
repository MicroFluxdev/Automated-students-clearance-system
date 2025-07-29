// // hooks/useAxiosInterceptor.ts
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "@/api/axios";
// import { useAuth } from "@/authentication/AuthContext";

// export const useAxiosInterceptor = () => {
//   const { accessToken, logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const requestIntercept = axiosInstance.interceptors.request.use(
//       (config) => {
//         if (accessToken) {
//           config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//       }
//     );

//     const responseIntercept = axiosInstance.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         if (error.response?.status === 401) {
//           await logout();
//           navigate("/login");
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosInstance.interceptors.request.eject(requestIntercept);
//       axiosInstance.interceptors.response.eject(responseIntercept);
//     };
//   }, [accessToken, logout, navigate]);
// };
