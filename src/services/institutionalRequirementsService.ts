import axiosInstance from "@/api/axios";

export interface InstitutionalRequirement {
  _id?: string;
  institutionalName: string;
  requirements: string[];
  department: string;
  description: string;
  semester: string;
  deadline: string; // ISO date string
  postedBy?: string; // User ID of the clearing officer who posted this
}

export interface CreateInstitutionalRequirementPayload {
  institutionalName: string;
  requirements: string[];
  department: string;
  description: string;
  semester: string;
  deadline: string;
  postedBy: string; // User ID of the clearing officer who posted this
}

/**
 * Create a new institutional requirement
 * @param data - The requirement data to create
 * @returns The created requirement data
 */
export const createInstitutionalRequirement = async (
  data: CreateInstitutionalRequirementPayload
) => {
  try {
    const response = await axiosInstance.post(
      "/institutional/createRequirement",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating institutional requirement:", error);
    throw error;
  }
};

/**
 * Get all institutional requirements
 * @returns Array of institutional requirements
 */
export const getAllInstitutionalRequirements = async () => {
  try {
    const response = await axiosInstance.get(
      "/institutional/getAllRequirements"
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching institutional requirements:", error);
    throw error;
  }
};

export const getInstitutionalRequirementById = async (id: string) => {
  try {
    console.log("Fetching requirement with ID:", id);
    const response = await axiosInstance.get(
      `/institutional/getRequiremntById/${id}`
    );
    console.log("Get by ID response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching institutional requirement by ID:", error);
    throw error;
  }
};

/**
 * Update an institutional requirement by ID
 * @param id - The requirement ID (_id from MongoDB)
 * @param data - The fields to update
 * @returns The updated requirement data
 */
export const updateInstitutionalRequirement = async (
  id: string,
  data: Partial<CreateInstitutionalRequirementPayload>
) => {
  try {
    console.log("Updating requirement with ID:", id);
    console.log("Update payload:", data);
    const response = await axiosInstance.put(
      `/institutional/updateRequirement/${id}`,
      data
    );
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating institutional requirement:", error);
    throw error;
  }
};

/**
 * Delete an institutional requirement by ID
 * @param id - The requirement ID (_id from MongoDB)
 * @returns Success message or deleted requirement data
 */
export const deleteInstitutionalRequirement = async (id: string) => {
  try {
    console.log("Deleting requirement with ID:", id);
    const response = await axiosInstance.delete(
      `/institutional/deleteRequirement/${id}`
    );
    console.log("Delete response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting institutional requirement:", error);
    throw error;
  }
};
