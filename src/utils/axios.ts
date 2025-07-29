// // src/utils/axios.ts
// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:8080",
//   withCredentials: true, // important to send cookies (refresh token)
// });

// // Store token in memory (will be set by AuthContext)
// let accessToken: string | null = null;

// // Function to set token (called from AuthContext)
// export const setAccessToken = (token: string | null) => {
//   accessToken = token;
// };

// // Function to get token
// export const getAccessToken = () => accessToken;

// // Request interceptor to add token to headers
// instance.interceptors.request.use(
//   (config) => {
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle token refresh
// instance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Try to refresh token
//         const response = await axios.post(
//           "http://localhost:8080/auth/refresh-token",
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = response.data.accessToken;
//         setAccessToken(newAccessToken);

//         // Retry original request with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return instance(originalRequest);
//       } catch (refreshError) {
//         // Refresh failed, redirect to login
//         setAccessToken(null);
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
