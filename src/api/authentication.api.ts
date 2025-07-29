// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export const login = async (email: string, password: string) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, {
//       email,
//       password,
//     });

//     return response.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const register = async (
//   studentId: string,
//   fullName: string,
//   email: string,
//   phoneNumber: string,
//   password: string,
//   role: string
// ) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, {
//       studentId,
//       fullName,
//       email,
//       phoneNumber,
//       password,
//       role,
//     });
//     return response.data;
//   } catch (error: any) {
//     throw error;
//   }
// };

// export const logout = async () => {
//   const response = await axios.post(`${API_URL}/logout`);
//   return response.data;
// };
