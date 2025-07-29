// let accessToken: string | null = null;

// export const setAccessToken = (token: string | null) => {
//   accessToken = token;
// };

// export const getAccessToken = () => accessToken;

// import axios from "../api/axios";

// // Refresh token stored in cookie
// export const refreshAccessToken = async (): Promise<string> => {
//   const res = await axios.post("/refresh-token", null, {
//     withCredentials: true,
//   });
//   const newToken = res.data.accessToken;
//   setAccessToken(newToken);
//   return newToken;
// };
