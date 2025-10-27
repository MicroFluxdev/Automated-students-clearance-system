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
      // 404 is expected when no students are enrolled - don't log as error
      if (error.response?.status === 404) {
        throw (
          error.response?.data || {
            message: `No students found enrolled in or requiring the subject '${courseCode}'`,
          }
        );
      }

      // Log other errors (500, network issues, etc.)
      console.error(
        `Error fetching students for ${courseCode}:`,
        error.message
      );
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
