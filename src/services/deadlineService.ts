import { type ClearanceStatus } from "./clearanceService";
import { message } from "antd";

/**
 * Deadline Service
 *
 * Senior-level service for managing clearance deadlines and automatic status updates.
 * Handles the business logic for marking student requirements as "missing" when deadlines pass.
 */

/**
 * Checks if the clearance deadline has passed
 * @param clearanceStatus - The current clearance status object
 * @returns true if the effective deadline has passed, false otherwise
 */
export const hasDeadlinePassed = (
  clearanceStatus: ClearanceStatus | null
): boolean => {
  if (!clearanceStatus) {
    return false;
  }

  // Determine the effective deadline (extended takes precedence)
  const effectiveDeadline =
    clearanceStatus.extendedDeadline || clearanceStatus.deadline;

  // Compare current date with deadline
  const now = new Date();
  const deadlineDate = new Date(effectiveDeadline);

  const isPassed = now > deadlineDate;

  if (isPassed) {
    console.log("⏰ Deadline has passed:", {
      currentDate: now.toISOString(),
      effectiveDeadline: deadlineDate.toISOString(),
      isExtended: !!clearanceStatus.extendedDeadline,
    });
  }

  return isPassed;
};

/**
 * Determines if automatic "missing" status updates should be triggered
 * @param clearanceStatus - The current clearance status object
 * @returns true if auto-update should proceed
 */
export const shouldAutoUpdateToMissing = (
  clearanceStatus: ClearanceStatus | null
): boolean => {
  if (!clearanceStatus) {
    console.log("⚠️ No clearance status available, skipping auto-update");
    return false;
  }

  // Only proceed if clearance was active but deadline has passed
  if (!clearanceStatus.isActive) {
    console.log("⚠️ Clearance is not active, skipping auto-update");
    return false;
  }

  const deadlinePassed = hasDeadlinePassed(clearanceStatus);

  if (deadlinePassed) {
    console.log("✅ Auto-update conditions met: deadline passed and clearance was active");
  }

  return deadlinePassed;
};

/**
 * Logs deadline status information for debugging
 * @param clearanceStatus - The current clearance status object
 */
export const logDeadlineStatus = (
  clearanceStatus: ClearanceStatus | null
): void => {
  if (!clearanceStatus) {
    console.log("📅 No clearance status available");
    return;
  }

  const effectiveDeadline =
    clearanceStatus.extendedDeadline || clearanceStatus.deadline;
  const now = new Date();
  const deadlineDate = new Date(effectiveDeadline);
  const isPassed = now > deadlineDate;

  console.log("📅 Clearance Deadline Status:", {
    isActive: clearanceStatus.isActive,
    deadline: clearanceStatus.deadline,
    extendedDeadline: clearanceStatus.extendedDeadline,
    effectiveDeadline,
    currentTime: now.toISOString(),
    deadlineTime: deadlineDate.toISOString(),
    hasPassed: isPassed,
    timeDifference: isPassed
      ? `${Math.floor((now.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24))} days overdue`
      : `${Math.floor((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days remaining`,
  });
};

/**
 * Shows a user-friendly notification about deadline status
 * @param clearanceStatus - The current clearance status object
 */
export const notifyDeadlineStatus = (
  clearanceStatus: ClearanceStatus | null
): void => {
  if (!clearanceStatus) return;

  const isPassed = hasDeadlinePassed(clearanceStatus);

  if (isPassed && clearanceStatus.isActive) {
    const effectiveDeadline =
      clearanceStatus.extendedDeadline || clearanceStatus.deadline;
    const deadlineDate = new Date(effectiveDeadline);
    const daysPassed = Math.floor(
      (new Date().getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    message.warning(
      `Clearance deadline passed ${daysPassed} day(s) ago. Incomplete requirements will be marked as missing.`,
      5
    );
  }
};
