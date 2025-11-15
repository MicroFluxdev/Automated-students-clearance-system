/**
 * Deadline Status Service
 *
 * Client-side utilities for deadline calculations and visual indicators
 * Used to show deadline urgency with color-coded badges
 */

/**
 * Check if a requirement's deadline has passed
 * Client-side utility for UI decisions
 *
 * @param deadline - Deadline date string (ISO format)
 * @returns True if deadline has passed
 */
export const isDeadlinePassed = (deadline: string | Date): boolean => {
  const deadlineDate =
    typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  return now > deadlineDate;
};

/**
 * Get time remaining until deadline
 * Useful for showing countdown timers
 *
 * @param deadline - Deadline date string (ISO format)
 * @returns Object with days, hours, minutes remaining (negative if passed)
 */
export const getTimeUntilDeadline = (
  deadline: string | Date
): {
  isPassed: boolean;
  days: number;
  hours: number;
  minutes: number;
  totalMilliseconds: number;
} => {
  const deadlineDate =
    typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  const diff = deadlineDate.getTime() - now.getTime();

  const isPassed = diff < 0;
  const absDiff = Math.abs(diff);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isPassed,
    days,
    hours,
    minutes,
    totalMilliseconds: diff,
  };
};
