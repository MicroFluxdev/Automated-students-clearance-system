import axiosInstance from "@/api/axios";

/**
 * Interface for the current clearance response
 */
export interface ClearanceStatus {
  id: string;
  isActive: boolean;
  startDate: string;
  deadline: string;
  extendedDeadline?: string;
  semesterType: string;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get the current (latest) clearance status
 * @returns The current clearance data
 */
export const getCurrentClearance = async (): Promise<ClearanceStatus> => {
  try {
    const response = await axiosInstance.get<ClearanceStatus>(
      "/clearance/current"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching current clearance:", error);
    throw error;
  }
};

/**
 * Get the effective deadline for the clearance
 * Uses extendedDeadline if available, otherwise uses deadline
 * @param clearance - The clearance status object
 * @returns The effective deadline date
 */
export const getEffectiveDeadline = (
  clearance: ClearanceStatus
): string => {
  return clearance.extendedDeadline || clearance.deadline;
};

/**
 * Check if a date is within the clearance period
 * @param date - The date to check
 * @param clearance - The clearance status object
 * @returns true if the date is within the clearance period
 */
export const isDateWithinClearancePeriod = (
  date: Date,
  clearance: ClearanceStatus
): boolean => {
  const startDate = new Date(clearance.startDate);
  const endDate = new Date(getEffectiveDeadline(clearance));

  // Reset time to midnight for accurate date comparison
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return checkDate >= startDate && checkDate <= endDate;
};
