// src/services/studentService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const getAllStudentSpecificSubject = async (courseCode: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/intigration/getAllstudentSpecificSubject/${courseCode}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching students by subject:", error);
      throw (
        error.response?.data || {
          message: "Failed to fetch students by subject",
        }
      );
    }

    console.error("Unexpected error fetching students by subject:", error);
    throw { message: "Failed to fetch students by subject" };
  }
};
