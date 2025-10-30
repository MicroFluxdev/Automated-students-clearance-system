import axiosInstance from "@/api/axios";
import { message } from "antd";

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

// Types/Interfaces
export interface CreateStudentRequirementDto {
  studentId: string;
  coId: string;
  requirementId: string;
  status: "signed" | "incomplete" | "missing";
}

export interface StudentRequirement {
  _id?: string;
  id?: string;
  studentId: string;
  coId: string;
  requirementId: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  requirement?: {
    id: string;
    userId: string;
    courseCode: string;
    courseName: string;
    yearLevel: string;
    semester: string;
    requirements: string[];
    department: string;
    dueDate: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  clearingOfficer?: {
    id: string;
    schoolId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const createStudentRequirement = async (
  data: CreateStudentRequirementDto
): Promise<StudentRequirement | null> => {
  try {
    console.log("📤 Sending student requirement data:", data);
    console.log("📍 Endpoint: POST /studentReq/studentRequirement");

    const response = await axiosInstance.post(
      "/studentReq/studentRequirement",
      data
    );

    console.log("✅ Response received:", response.data);
    message.success("Student requirement created successfully");
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Full error object:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
          statusText?: string;
        };
      };
      console.error("❌ Error response data:", axiosError.response?.data);
      console.error("❌ Error status:", axiosError.response?.status);
      console.error("❌ Error status text:", axiosError.response?.statusText);
    }

    const errorMessage = getErrorMessage(
      error,
      "Failed to create student requirement"
    );
    message.error(errorMessage);
    console.error("Create student requirement error:", error);
    return null;
  }
};

export const createBulkStudentRequirements = async (
  requirements: CreateStudentRequirementDto[]
): Promise<StudentRequirement[]> => {
  try {
    const promises = requirements.map((req) =>
      axiosInstance.post("/studentReq/studentRequirement", req)
    );
    const results = await Promise.allSettled(promises);

    const successfulRequirements: StudentRequirement[] = [];
    let failedCount = 0;

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successfulRequirements.push(result.value.data);
      } else {
        failedCount++;
        console.error(
          `Failed to create requirement for student ${requirements[index].studentId}:`,
          result.reason
        );
      }
    });

    if (failedCount > 0) {
      message.warning(
        `Created ${successfulRequirements.length} requirements. ${failedCount} failed.`
      );
    } else {
      message.success(
        `Successfully created ${successfulRequirements.length} student requirements`
      );
    }

    return successfulRequirements;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(
      error,
      "Failed to create bulk student requirements"
    );
    message.error(errorMessage);
    console.error("Create bulk student requirements error:", error);
    return [];
  }
};

/**
 * Get all student requirements with populated requirement and clearingOfficer data
 * GET /studentReq/getAllStudentRequirements
 */
export const getAllStudentRequirements = async (): Promise<StudentRequirement[]> => {
  try {
    console.log("📤 Fetching all student requirements");
    console.log("📍 Endpoint: GET /studentReq/getAllStudentRequirements");

    const response = await axiosInstance.get(
      "/studentReq/getAllStudentRequirements"
    );

    console.log("✅ Response received:", response.data);
    console.log(`✅ Total requirements fetched: ${response.data?.length || 0}`);

    return response.data;
  } catch (error: unknown) {
    console.error("❌ Full error object:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
          statusText?: string;
        };
      };
      console.error("❌ Error response data:", axiosError.response?.data);
      console.error("❌ Error status:", axiosError.response?.status);
      console.error("❌ Error status text:", axiosError.response?.statusText);
    }

    const errorMessage = getErrorMessage(
      error,
      "Failed to fetch student requirements"
    );
    message.error(errorMessage);
    console.error("Get all student requirements error:", error);
    return [];
  }
};

/**
 * Update student requirement by ID
 * PUT /studentReq/updateStudentRequirement/:id
 */
export const updateStudentRequirement = async (
  id: string,
  status: "signed" | "incomplete" | "missing"
): Promise<StudentRequirement | null> => {
  try {
    console.log("📤 Updating student requirement:");
    console.log("   - ID:", id);
    console.log("   - New Status:", status);
    console.log("📍 Full Endpoint: PUT", `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/studentReq/updateStudentRequirement/${id}`);

    const response = await axiosInstance.put(
      `/studentReq/updateStudentRequirement/${id}`,
      { status }
    );

    console.log("✅ Update response received:", response.data);
    console.log("✅ Updated status:", response.data?.status);
    message.success("Student requirement updated successfully");
    return response.data;
  } catch (error: unknown) {
    console.error("❌ Full error object:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
          statusText?: string;
        };
      };
      console.error("❌ Error response data:", axiosError.response?.data);
      console.error("❌ Error status:", axiosError.response?.status);
      console.error("❌ Error status text:", axiosError.response?.statusText);
    }

    const errorMessage = getErrorMessage(
      error,
      "Failed to update student requirement"
    );
    message.error(errorMessage);
    console.error("Update student requirement error:", error);
    return null;
  }
};
