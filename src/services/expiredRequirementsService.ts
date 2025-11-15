// import axiosInstance from "@/api/axios";
// import type { StudentRequirement } from "./studentRequirementService";

// /**
//  * Service for handling expired requirements and updating student statuses
//  * When a requirement's due date passes, this service updates incomplete submissions to "missing"
//  */

// export interface RequirementWithDueDate {
//   _id?: string;
//   id?: string;
//   dueDate: string | Date;
// }

// /**
//  * Check if a due date has expired
//  * @param dueDate - The due date to check
//  * @returns true if the due date has passed
//  */
// export const isDueDateExpired = (dueDate: string | Date): boolean => {
//   const now = new Date();
//   const deadline = new Date(dueDate);
//   return now > deadline;
// };

// /**
//  * Check if a due date is in the future
//  * @param dueDate - The due date to check
//  * @returns true if the due date is in the future
//  */
// export const isDueDateInFuture = (dueDate: string | Date): boolean => {
//   const now = new Date();
//   const deadline = new Date(dueDate);
//   // Set time to end of day for deadline comparison
//   deadline.setHours(23, 59, 59, 999);
//   return deadline > now;
// };

// /**
//  * Update expired student requirements from "incomplete" to "missing"
//  * Also creates "missing" records for students who don't have any record yet
//  * IMPORTANT: When updating status to "missing" due to expired deadline,
//  * the signedBy field is NOT changed - it remains whatever it was before.
//  * @param requirementId - The requirement ID to check
//  * @param dueDate - The due date of the requirement
//  * @param allStudentRequirements - All student requirements to filter
//  * @param allStudentIds - Array of all student IDs who should have this requirement (optional)
//  * @param coId - Clearing officer ID for creating new records (optional)
//  * @returns Updated student requirements or null if none updated
//  */
// export const updateExpiredRequirements = async (
//   requirementId: string,
//   dueDate: string | Date,
//   allStudentRequirements: StudentRequirement[],
//   allStudentIds?: string[],
//   coId?: string
// ): Promise<StudentRequirement[] | null> => {
//   // Check if due date has expired
//   if (!isDueDateExpired(dueDate)) {
//     console.log(`📅 Requirement ${requirementId} is not expired yet`);
//     return null;
//   }

//   console.log(
//     `⏰ Requirement ${requirementId} has expired, checking for incomplete/missing submissions...`
//   );

//   // Filter student requirements that are incomplete for this requirement
//   const expiredIncompleteRequirements = allStudentRequirements.filter(
//     (req) => req.requirementId === requirementId && req.status === "incomplete"
//   );

//   // Find students who don't have any record yet (if allStudentIds is provided)
//   const studentsWithoutRecords: string[] = [];
//   if (allStudentIds && coId) {
//     const studentsWithRecords = allStudentRequirements
//       .filter((req) => req.requirementId === requirementId)
//       .map((req) => req.studentId);

//     studentsWithoutRecords.push(
//       ...allStudentIds.filter(
//         (studentId) => !studentsWithRecords.includes(studentId)
//       )
//     );
//   }

//   const totalToUpdate =
//     expiredIncompleteRequirements.length + studentsWithoutRecords.length;

//   if (totalToUpdate === 0) {
//     console.log(
//       `✅ No incomplete submissions or missing records found for expired requirement ${requirementId}`
//     );
//     return null;
//   }

//   console.log(
//     `🔄 Found ${expiredIncompleteRequirements.length} incomplete submission(s) to mark as missing`
//   );
//   if (studentsWithoutRecords.length > 0) {
//     console.log(
//       `🔄 Found ${studentsWithoutRecords.length} student(s) without records to create as missing`
//     );
//   }

//   const updatePromises: Promise<StudentRequirement | null>[] = [];

//   // Update each incomplete requirement to "missing"
//   expiredIncompleteRequirements.forEach((req) => {
//     const promise = (async () => {
//       try {
//         const reqId = req._id || req.id;
//         if (!reqId) {
//           console.error("❌ Student requirement has no ID:", req);
//           return null;
//         }

//         // Call API to update status to "missing"
//         // IMPORTANT: Explicitly include signedBy to ensure it's preserved when status changes
//         // The signedBy value (whether it's a user's role or "system") must remain unchanged
//         // when the deadline expires - only the status field should be updated
//         const response = await axiosInstance.put(
//           `/studentReq/updateStudentRequirement/${req.studentId}`,
//           {
//             status: "missing",
//             studentId: req.studentId,
//             coId: req.coId,
//             requirementId: req.requirementId,
//             signedBy: req.signedBy, // Explicitly preserve the existing signedBy value
//           }
//         );

//         console.log(`✅ Updated requirement ${reqId} to missing (preserved signedBy: ${req.signedBy})`);
//         return response.data;
//       } catch (error) {
//         console.error(
//           `❌ Error updating requirement ${req._id || req.id}:`,
//           error
//         );
//         return null;
//       }
//     })();
//     updatePromises.push(promise);
//   });

//   // Create "missing" records for students without any record
//   if (studentsWithoutRecords.length > 0 && coId) {
//     studentsWithoutRecords.forEach((studentId) => {
//       const promise = (async () => {
//         try {
//           // Call API to create a new requirement with "missing" status
//           const response = await axiosInstance.post(
//             "/studentReq/studentRequirement",
//             {
//               studentId: studentId,
//               coId: coId,
//               requirementId: requirementId,
//               signedBy: "system", // Mark as system-generated
//               status: "missing",
//             }
//           );

//           console.log(`✅ Created missing record for student ${studentId}`);
//           return response.data?.data || response.data;
//         } catch (error) {
//           console.error(
//             `❌ Error creating missing record for student ${studentId}:`,
//             error
//           );
//           return null;
//         }
//       })();
//       updatePromises.push(promise);
//     });
//   }

//   // Wait for all updates to complete
//   const updatedRequirements = await Promise.all(updatePromises);

//   // Filter out null results (failed updates)
//   const successfulUpdates = updatedRequirements.filter(
//     (req): req is StudentRequirement => req !== null
//   );

//   console.log(
//     `✅ Successfully updated ${successfulUpdates.length}/${totalToUpdate} requirements to missing`
//   );

//   return successfulUpdates.length > 0 ? successfulUpdates : null;
// };

// /**
//  * Batch update all expired requirements for multiple requirements
//  * @param requirements - Array of requirements with due dates
//  * @param allStudentRequirements - All student requirements
//  * @returns Total count of updated requirements
//  */
// export const batchUpdateExpiredRequirements = async (
//   requirements: RequirementWithDueDate[],
//   allStudentRequirements: StudentRequirement[]
// ): Promise<number> => {
//   console.log(
//     `🔍 Checking ${requirements.length} requirement(s) for expired due dates...`
//   );

//   let totalUpdated = 0;

//   // Process each requirement
//   for (const requirement of requirements) {
//     const reqId = requirement._id || requirement.id;
//     if (!reqId) {
//       console.warn("⚠️ Requirement has no ID:", requirement);
//       continue;
//     }

//     try {
//       const updatedRequirements = await updateExpiredRequirements(
//         reqId,
//         requirement.dueDate,
//         allStudentRequirements
//       );

//       if (updatedRequirements) {
//         totalUpdated += updatedRequirements.length;
//       }
//     } catch (error) {
//       console.error(`❌ Error processing requirement ${reqId}:`, error);
//     }
//   }

//   if (totalUpdated > 0) {
//     console.log(
//       `✅ Batch update complete: ${totalUpdated} total requirement(s) marked as missing`
//     );
//   } else {
//     console.log("✅ Batch update complete: No requirements needed updating");
//   }

//   return totalUpdated;
// };

// /**
//  * Update "missing" student requirements back to "incomplete" when due date is extended
//  * This is called when a requirement's due date is updated to a future date
//  * @param requirementId - The requirement ID to check
//  * @param dueDate - The new due date of the requirement
//  * @param allStudentRequirements - All student requirements to filter
//  * @returns Updated student requirements or null if none updated
//  */
// export const updateExtendedDeadlineRequirements = async (
//   requirementId: string,
//   dueDate: string | Date,
//   allStudentRequirements: StudentRequirement[]
// ): Promise<StudentRequirement[] | null> => {
//   // Check if due date is in the future
//   if (!isDueDateInFuture(dueDate)) {
//     console.log(
//       `📅 Requirement ${requirementId} due date is not in the future`
//     );
//     return null;
//   }

//   console.log(
//     `⏰ Requirement ${requirementId} due date extended to future, checking for missing submissions...`
//   );

//   // Filter student requirements that are "missing" (not "signed") for this requirement
//   const missingRequirements = allStudentRequirements.filter(
//     (req) => req.requirementId === requirementId && req.status === "missing"
//   );

//   if (missingRequirements.length === 0) {
//     console.log(
//       `✅ No missing submissions found for requirement ${requirementId} to revert to incomplete`
//     );
//     return null;
//   }

//   console.log(
//     `🔄 Found ${missingRequirements.length} missing submission(s) to revert to incomplete`
//   );

//   // Update each missing requirement to "incomplete"
//   const updatePromises = missingRequirements.map(async (req) => {
//     try {
//       const reqId = req._id || req.id;
//       if (!reqId) {
//         console.error("❌ Student requirement has no ID:", req);
//         return null;
//       }

//       // Call API to update status to "incomplete"
//       // IMPORTANT: Explicitly include signedBy to preserve it when status changes
//       const response = await axiosInstance.put(
//         `/studentReq/updateStudentRequirement/${req.studentId}`,
//         {
//           status: "incomplete",
//           studentId: req.studentId,
//           coId: req.coId,
//           requirementId: req.requirementId,
//           signedBy: req.signedBy, // Explicitly preserve the existing signedBy value
//         }
//       );

//       console.log(`✅ Updated requirement ${reqId} from missing to incomplete (preserved signedBy: ${req.signedBy})`);
//       return response.data;
//     } catch (error) {
//       console.error(
//         `❌ Error updating requirement ${req._id || req.id}:`,
//         error
//       );
//       return null;
//     }
//   });

//   // Wait for all updates to complete
//   const updatedRequirements = await Promise.all(updatePromises);

//   // Filter out null results (failed updates)
//   const successfulUpdates = updatedRequirements.filter(
//     (req): req is StudentRequirement => req !== null
//   );

//   console.log(
//     `✅ Successfully updated ${successfulUpdates.length}/${missingRequirements.length} requirements from missing to incomplete`
//   );

//   return successfulUpdates.length > 0 ? successfulUpdates : null;
// };

// /**
//  * API endpoint to trigger batch update on backend (for future implementation)
//  * This would be better handled by a backend cron job
//  */
// export const triggerBackendExpiredCheck = async (): Promise<void> => {
//   try {
//     // This endpoint should be implemented on the backend
//     await axiosInstance.post("/studentReq/updateExpiredSubmissions");
//     console.log("✅ Backend expired requirements check triggered");
//   } catch (error) {
//     console.error("❌ Error triggering backend expired check:", error);
//     // If endpoint doesn't exist, fail silently
//   }
// };
