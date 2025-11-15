// src/services/studentService.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:4000";
// const UPDATE_USER_API_BASE_URL = "http://localhost:3000";

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

export const getAllStudentBySchoolId = async (schoolId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/intigration/getAllStudentBySchoolId/${schoolId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error fetching student with schoolId ${schoolId}:`,
        error.message
      );
      throw (
        error.response?.data || {
          message: "Failed to fetch student by school ID",
        }
      );
    }

    console.error("Unexpected error fetching student by school ID:", error);
    throw { message: "Failed to fetch student by school ID" };
  }
};

// Fetch multiple students by their school IDs
export const getMultipleStudentsBySchoolIds = async (schoolIds: string[]) => {
  try {
    // Make parallel requests for each school ID
    const promises = schoolIds.map((schoolId) =>
      getAllStudentBySchoolId(schoolId.trim())
    );
    const results = await Promise.allSettled(promises);

    // Collect all successful responses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const students: any[] = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const data = result.value;
        // Handle both array and object responses
        if (Array.isArray(data)) {
          students.push(...data);
        } else if (data.data && Array.isArray(data.data)) {
          students.push(...data.data);
        } else if (data) {
          students.push(data);
        }
      } else {
        console.warn(
          `Failed to fetch student with schoolId ${schoolIds[index]}:`,
          result.reason
        );
      }
    });

    return students;
  } catch (error) {
    console.error("Unexpected error fetching multiple students:", error);
    throw { message: "Failed to fetch students by school IDs" };
  }
};
