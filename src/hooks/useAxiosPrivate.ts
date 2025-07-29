import { useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../authentication/useAuth";

export const useAxiosPrivate = () => {
  const { accessToken, setAccessToken } = useAuth();

  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      (config) => {
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response?.status === 401 && !prevRequest._retry) {
          prevRequest._retry = true;

          try {
            const res = await axios.post(
              "/refresh-token",
              {},
              { withCredentials: true }
            );
            const newAccessToken = res.data.accessToken;
            setAccessToken(newAccessToken);

            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(prevRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, setAccessToken]);

  return axios;
};
