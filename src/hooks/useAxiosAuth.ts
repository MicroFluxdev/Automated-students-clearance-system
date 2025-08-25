/**
 * Custom hook for authenticated axios instance
 * This hook provides an axios instance that automatically includes
 * the authentication token from memory storage
 */

// import { useEffect } from "react";
// import axiosInstance from "@/api/axios";
// import tokenService from "@/authentication/tokenService";

// export const useAxiosAuth = () => {
//   useEffect(() => {
//     const requestIntercept = axiosInstance.interceptors.request.use(
//       (config) => {
//         // Get token from memory
//         const token = tokenService.getAccessToken();

//         if (token && !config.headers["Authorization"]) {
//           config.headers["Authorization"] = `Bearer ${token}`;
//         }

//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     return () => {
//       axiosInstance.interceptors.request.eject(requestIntercept);
//     };
//   }, []);

//   return axiosInstance;
// };
