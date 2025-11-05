import axiosInstance from "@/api/axios";

/**
 * Student year level types
 */
export type YearLevel = "1st Year" | "2nd Year" | "3rd Year" | "4th Year";

/**
 * Interface representing a Student in the system
 */
export interface Student {
  _id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  program: string;
  yearLevel: YearLevel;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new student
 */
export interface CreateStudentPayload {
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  program: string;
  yearLevel: YearLevel;
  password: string;
}

/**
 * Payload for updating an existing student
 */
export interface UpdateStudentPayload {
  schoolId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  program?: string;
  yearLevel?: YearLevel;
}

/**
 * Response type from API that might have 'id' or '_id'
 */
interface StudentResponse {
  _id?: string;
  id?: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  program: string;
  yearLevel: YearLevel;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch all students from the system
 * @returns Array of students
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await axiosInstance.get<StudentResponse[]>("/student/getAllStudent");
    const students = response.data;

    // Normalize ID field: handle both 'id' and '_id'
    return students.map((student) => ({
      ...student,
      _id: student._id || student.id || "",
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

/**
 * Fetch a single student by ID
 * @param id - The student's unique identifier
 * @returns The student data
 */
export const getStudentById = async (id: string): Promise<Student> => {
  try {
    const response = await axiosInstance.get(`/student/getByIdStudent/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching student with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new student
 * @param data - The student data including password
 * @returns The newly created student
 */
export const createStudent = async (
  data: CreateStudentPayload
): Promise<Student> => {
  try {
    console.log("Creating student with payload:", data);
    const response = await axiosInstance.post("/student/registerStudent", data);
    console.log("Create response:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating student:", error);

    // Type guard for axios error
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
      };
      console.error("Error response:", axiosError.response?.data);
      console.error("Error status:", axiosError.response?.status);

      // Extract the actual error message from the backend
      const backendMessage =
        axiosError.response?.data?.message || axiosError.response?.data?.error;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
    }
    throw error;
  }
};

/**
 * Update an existing student
 * @param id - The student's unique identifier
 * @param data - The fields to update
 * @returns The updated student data
 */
export const updateStudent = async (
  id: string,
  data: UpdateStudentPayload
): Promise<Student> => {
  try {
    const response = await axiosInstance.put(
      `/student/updateStudent/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating student with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a student from the system
 * @param id - The student's unique identifier
 * @returns Success message
 */
export const deleteStudent = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(
      `/student/deleteStudent/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting student with ID ${id}:`, error);
    throw error;
  }
};
