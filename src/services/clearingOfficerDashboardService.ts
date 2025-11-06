import axiosInstance from "@/api/axios";
import type { ClearanceStatus } from "./clearanceService";
import type { StudentRequirement } from "./studentRequirementService";

/**
 * Clearing Officer Dashboard Analytics Interfaces
 */
export interface ClearingOfficerDashboardStats {
  totalCourses: number;
  totalDepartments: number;
  totalYearLevels: number;
  activeClearance: ClearanceStatus | null;
  myRequirementStats: {
    signed: number;
    incomplete: number;
    missing: number;
    pending: number;
    total: number;
  };
  myRequirementsBySemester: {
    [semester: string]: number;
  };
  recentSubmissions: StudentRequirement[];
}

/**
 * Fetch clearing officer dashboard analytics data
 * Gets data specific to the logged-in clearing officer
 */
export const fetchClearingOfficerDashboardStats = async (
  coId?: string
): Promise<ClearingOfficerDashboardStats> => {
  try {
    // Fetch all required data in parallel
    const [clearanceResponse, requirementsResponse] = await Promise.all([
      axiosInstance.get<
        ClearanceStatus | ClearanceStatus[] | { data: ClearanceStatus[] }
      >("/clearance/current"),
      axiosInstance.get<StudentRequirement[] | { data: StudentRequirement[] }>(
        "/studentReq/getAllStudentRequirements"
      ),
    ]);

    // Normalize clearance response (handle array or nested array)
    const clearanceRaw = clearanceResponse.data as
      | ClearanceStatus
      | ClearanceStatus[]
      | { data: ClearanceStatus[] };
    let clearance: ClearanceStatus | null = null;
    if (Array.isArray(clearanceRaw)) {
      clearance = clearanceRaw[0] || null;
    } else if (
      clearanceRaw &&
      typeof clearanceRaw === "object" &&
      (clearanceRaw as { data?: ClearanceStatus[] }).data
    ) {
      const arr = (clearanceRaw as { data: ClearanceStatus[] }).data;
      clearance = Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
    } else {
      clearance = clearanceRaw as ClearanceStatus;
    }

    // Handle nested response structure for requirements
    const requirementsData:
      | StudentRequirement[]
      | { data: StudentRequirement[] } = requirementsResponse.data;
    const allRequirements: StudentRequirement[] = Array.isArray(
      requirementsData
    )
      ? requirementsData
      : requirementsData?.data || [];

    // Filter requirements that belong to this officer (client-side guard)
    // Prefer `coId` field, fall back to populated relations if present
    const myRequirements = coId
      ? allRequirements.filter(
          (req) =>
            req.coId === coId ||
            req.clearingOfficer?.id === coId ||
            req.requirement?.userId === coId
        )
      : allRequirements;

    // Calculate total courses count
    const uniqueCourseIds = new Set(
      myRequirements
        .filter((req: StudentRequirement) => req.requirement?.id)
        .map((req: StudentRequirement) => req.requirement!.id)
    );
    const totalCourses = uniqueCourseIds.size;

    // Calculate total unique departments
    const uniqueDepartments = new Set(
      myRequirements
        .filter((req: StudentRequirement) => req.requirement?.department)
        .map((req: StudentRequirement) => req.requirement!.department)
    );
    const totalDepartments = uniqueDepartments.size;

    // Calculate total unique year levels
    const uniqueYearLevels = new Set(
      myRequirements
        .filter((req: StudentRequirement) => req.requirement?.yearLevel)
        .map((req: StudentRequirement) => req.requirement!.yearLevel)
    );
    const totalYearLevels = uniqueYearLevels.size;

    // Calculate requirements by semester
    const myRequirementsBySemester: { [semester: string]: number } = {};
    myRequirements.forEach((req: StudentRequirement) => {
      // Normalize missing/empty semester values to a friendly label
      const rawSemester = (req.requirement?.semester || "").toString().trim();
      const semester = rawSemester.length > 0 ? rawSemester : "Unspecified";
      myRequirementsBySemester[semester] =
        (myRequirementsBySemester[semester] || 0) + 1;
    });

    // Calculate requirement statistics for my students
    const myRequirementStats = {
      signed: myRequirements.filter(
        (r: StudentRequirement) => r.status === "signed"
      ).length,
      incomplete: myRequirements.filter(
        (r: StudentRequirement) => r.status === "incomplete"
      ).length,
      missing: myRequirements.filter(
        (r: StudentRequirement) => r.status === "missing"
      ).length,
      pending: myRequirements.filter(
        (r: StudentRequirement) =>
          r.status !== "signed" &&
          r.status !== "incomplete" &&
          r.status !== "missing"
      ).length,
      total: myRequirements.length,
    };

    // Get recent submissions (last 10)
    const recentSubmissions = myRequirements
      .filter((r: StudentRequirement) => r.updatedAt)
      .sort((a: StudentRequirement, b: StudentRequirement) => {
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 10);

    return {
      totalCourses,
      totalDepartments,
      totalYearLevels,
      activeClearance: clearance || null,
      myRequirementStats,
      myRequirementsBySemester,
      recentSubmissions,
    };
  } catch (error) {
    console.error("Error fetching clearing officer dashboard stats:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch dashboard statistics";
    throw new Error(errorMessage);
  }
};

/**
 * Calculate days remaining until clearance deadline
 */
export const getDaysUntilDeadline = (
  clearance: ClearanceStatus | null
): number => {
  if (!clearance) return 0;

  const deadline = clearance.extendedDeadline || clearance.deadline;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

/**
 * Calculate clearance completion rate for officer's students
 */
export const getCompletionRate = (
  stats: ClearingOfficerDashboardStats
): number => {
  if (stats.myRequirementStats.total === 0) return 0;

  const completionRate =
    (stats.myRequirementStats.signed / stats.myRequirementStats.total) * 100;

  return Math.round(completionRate * 10) / 10; // Round to 1 decimal
};
