import axiosInstance from "../api/axios";

// This hook simply returns the shared axios instance.
// Interceptors are installed centrally in `AuthContext`.
export const useAxiosPrivate = () => {
  return axiosInstance;
};
