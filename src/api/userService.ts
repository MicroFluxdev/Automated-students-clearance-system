import axiosInstance from "./axios";

/**
 * Payload for updating user profile information
 */
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

/**
 * Payload for updating user password
 */
export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/**
 * Payload for updating user avatar/profile image
 */
export interface UpdateAvatarPayload {
  avatar: File | string;
}

/**
 * Update user profile information
 * @param userId - The user ID
 * @param data - The profile fields to update
 * @returns The updated user data
 */
export const updateUserProfile = async (
  userId: string,
  data: UpdateProfilePayload
) => {
  try {
    const response = await axiosInstance.put(
      `/updateUser/updateUserProfile/${userId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Update user password
 * @param userId - The user ID
 * @param data - Current and new password
 * @returns Success message
 */
export const updateUserPassword = async (
  userId: string,
  data: UpdatePasswordPayload
) => {
  try {
    const response = await axiosInstance.put(
      `/updateUser/updateUserPassword/${userId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

/**
 * Update user avatar/profile image
 * @param data - The avatar file or base64 string
 * @returns The updated user data with new avatar URL
 */
export const updateAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.put("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
};

/**
 * Delete user account
 * @returns Success message
 */
export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete("/user/account");
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
