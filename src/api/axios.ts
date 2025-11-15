import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
export const API_URL = import.meta.env.VITE_INTIGRATION_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosInstance;
