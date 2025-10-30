import React, { useMemo, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Mail,
  CheckCircle,
  Undo,
  Phone,
  Book,
  PackageX,
  ChevronLeft,
  XCircle,
  Clock,
  IdCard,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TooltipDemo from "@/components/HoverToolip";
import PaginationComponent from "./_components/PaginationComponent";
import { Spin, message } from "antd";
import {
  getAllStudentSpecificSubject,
  getMultipleStudentsBySchoolIds,
} from "@/services/intigration.services";
import { useAuth } from "@/authentication/useAuth";
import {
  createStudentRequirement,
  createBulkStudentRequirements,
  updateStudentRequirement,
  getAllStudentRequirements,
  findExistingStudentRequirement,
  type StudentRequirement,
} from "@/services/studentRequirementService";

interface ApiStudentData {
  id?: string;
  schoolId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  courseCode?: string;
  yearLevel?: string;
  profilePic?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  id_no: string;
  cp_no: string;
  profilePic: string;
  status: string;
  initials: string;
  studentRequirementId?: string; // Store the student requirement ID from the database
}

interface ConfirmDialog {
  isOpen: boolean;
  type?: "single" | "multiple";
  studentId?: string;
  studentName?: string;
  onConfirm?: () => void;
}

const StudentRecord: React.FC = () => {
  const navigation = useNavigate();
  const { courseCode, reqId } = useParams<{
    courseCode: string;
    reqId: string;
  }>();
  const { user } = useAuth();

  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
  });
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [allStudentRequirements, setAllStudentRequirements] = useState<
    StudentRequirement[]
  >([]);

  const statuses = ["all", "Signed", "Incomplete", "Missing"];
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      if (!courseCode) {
        console.warn("No courseCode provided, skipping fetch");
        setIsLoadingStudents(false);
        return;
      }

      setIsLoadingStudents(true);
      setFetchError(null);

      try {
        console.log(`Fetching students enrolled in course: ${courseCode}`);
        const response = await getAllStudentSpecificSubject(courseCode);
        console.log("API Response:", response);

        let students: ApiStudentData[] = [];

        // Extract students array from response
        if (Array.isArray(response)) {
          students = response;
        } else if (response.data && Array.isArray(response.data)) {
          students = response.data;
        } else if (response.students && Array.isArray(response.students)) {
          students = response.students;
        }

        console.log("Extracted students:", students);

        // Get school IDs from the extracted students
        const schoolIds = students
          .map((s) => s.schoolId)
          .filter((id): id is string => !!id);

        console.log("School IDs to fetch:", schoolIds);

        // Fetch detailed student data by school IDs
        let detailedStudents: ApiStudentData[] = [];
        if (schoolIds.length > 0) {
          try {
            const detailedResponse = await getMultipleStudentsBySchoolIds(
              schoolIds
            );
            console.log("Detailed students response:", detailedResponse);

            if (
              Array.isArray(detailedResponse) &&
              detailedResponse.length > 0
            ) {
              detailedStudents = detailedResponse as ApiStudentData[];
            } else {
              detailedStudents = students;
            }
          } catch (detailError) {
            console.warn(
              "Could not fetch detailed student data, using basic data:",
              detailError
            );
            detailedStudents = students;
          }
        } else {
          detailedStudents = students;
        }

        // Transform API data to match the expected student format
        const transformedStudents = detailedStudents.map(
          (student: ApiStudentData) => {
            const fullName = `${student.firstName || ""} ${
              student.lastName || ""
            }`.trim();
            const initials = `${student.firstName?.charAt(0) || ""}${
              student.lastName?.charAt(0) || ""
            }`.toUpperCase();

            return {
              id: student.id || student.schoolId || "N/A",
              name: fullName || "Unknown Student",
              email: student.email ?? "N/A",
              id_no: student.schoolId ?? "N/A",
              cp_no: student.phone ?? "N/A",
              profilePic: student.profilePic ?? "",
              status: "Incomplete", // Default status
              initials: initials || "?",
            };
          }
        );

        console.log(
          `Fetched and transformed ${transformedStudents.length} students for course ${courseCode}`
        );

        // Fetch all student requirements to check for existing signed students
        try {
          console.log(
            "🔍 Fetching student requirements to check for signed students..."
          );
          const allRequirements = await getAllStudentRequirements();
          console.log(
            `✅ Fetched ${allRequirements.length} student requirements`
          );

          // Store all requirements in state for later use when signing
          setAllStudentRequirements(allRequirements);

          // Filter requirements that match the current requirement ID
          const relevantRequirements = allRequirements.filter(
            (req) => req.requirementId === reqId
          );
          console.log(
            `📋 Found ${relevantRequirements.length} requirements for current requirement ID: ${reqId}`
          );

          // Create a map of studentId -> requirement for quick lookup
          const requirementMap = new Map(
            relevantRequirements.map((req) => [req.studentId, req])
          );

          // Merge student requirements with student data
          const studentsWithRequirements = transformedStudents.map(
            (student) => {
              const requirement = requirementMap.get(student.id_no);
              if (requirement) {
                const reqId = requirement._id || requirement.id;
                console.log(
                  `✓ Student ${student.id_no} has requirement with status: ${requirement.status}, _id: ${reqId}`
                );
                return {
                  ...student,
                  status:
                    requirement.status === "signed"
                      ? "Signed"
                      : requirement.status === "incomplete"
                      ? "Incomplete"
                      : requirement.status === "missing"
                      ? "Missing"
                      : "Incomplete",
                  studentRequirementId: reqId,
                };
              }
              return student;
            }
          );

          setStudentList(studentsWithRequirements);
          console.log(
            "✅ Students merged with requirements:",
            studentsWithRequirements
          );
        } catch (reqError) {
          console.warn("⚠️ Could not fetch student requirements:", reqError);
          // If fetching requirements fails, just use the transformed students without requirements
          setStudentList(transformedStudents);
        }

        const idNumbers = transformedStudents.map((user) => user.id_no);
        console.log("Student ID numbers:", idNumbers);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudentList([]);

        // Set user-friendly error message
        if (error && typeof error === "object" && "message" in error) {
          setFetchError(error.message as string);
        } else {
          setFetchError(`No students enrolled in ${courseCode}`);
        }
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [courseCode, reqId]);

  const filteredStudents = useMemo(
    () =>
      studentList
        .filter(
          (student) =>
            (student.name.toLowerCase().includes(search.toLowerCase()) ||
              student.email.toLowerCase().includes(search.toLowerCase()) ||
              student.id_no.toLowerCase().includes(search.toLowerCase())) &&
            (selectedStatus === "all" || student.status === selectedStatus)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [studentList, search, selectedStatus]
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage, studentsPerPage]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedStudents(checked ? filteredStudents.map((s) => s.id) : []);
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    setSelectedStudents((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  const handleSignSelected = async () => {
    // Get all selected students' id_no
    const selectedStudentsData = studentList.filter((student) =>
      selectedStudents.includes(student.id)
    );
    const selectedIdNumbers = selectedStudentsData.map(
      (student) => student.id_no
    );

    console.log(`Signing ${selectedStudentsData.length} selected students`);
    console.log("Selected Student ID Numbers:", selectedIdNumbers);
    console.log("Clearing Officer ID:", user?.id);
    console.log("Requirement ID:", reqId);

    // Validate required data
    if (!user?.id) {
      message.error("Clearing officer ID not found");
      return;
    }
    if (!reqId) {
      message.error("Requirement ID not found");
      return;
    }
    if (selectedStudentsData.length === 0) {
      message.error("No students selected");
      return;
    }

    try {
      // Show loading message
      const hideLoading = message.loading(
        `Signing ${selectedStudentsData.length} student(s)...`,
        0
      );

      console.log("🔍 Checking for existing requirements in bulk sign...");

      // Separate students into those with existing requirements and those without
      const studentsToUpdate: Array<{
        student: (typeof selectedStudentsData)[0];
        existingReqId: string;
      }> = [];
      const studentsToCreate: typeof selectedStudentsData = [];

      selectedStudentsData.forEach((student) => {
        const existingRequirement = findExistingStudentRequirement(
          allStudentRequirements,
          student.id_no,
          user.id,
          reqId
        );

        if (existingRequirement) {
          const existingId = existingRequirement._id || existingRequirement.id;
          console.log(
            `♻️ Student ${student.id_no} has existing requirement: ${existingId}`
          );
          studentsToUpdate.push({ student, existingReqId: existingId! });
        } else {
          console.log(`➕ Student ${student.id_no} needs new requirement`);
          studentsToCreate.push(student);
        }
      });

      console.log(
        `📊 Summary: ${studentsToUpdate.length} to update, ${studentsToCreate.length} to create`
      );

      const studentReqIdMap = new Map<string, string>();

      // Update existing requirements
      if (studentsToUpdate.length > 0) {
        console.log("🔄 Updating existing requirements...");
        const updatePromises = studentsToUpdate.map(
          ({ student, existingReqId }) =>
            updateStudentRequirement(
              existingReqId,
              "signed",
              student.id_no,
              user.id,
              reqId
            ).then((result) => ({ student, result, existingReqId }))
        );

        const updateResults = await Promise.allSettled(updatePromises);
        const successfulUpdateIds: string[] = [];

        updateResults.forEach((promiseResult) => {
          if (promiseResult.status === "fulfilled") {
            const { student, existingReqId } = promiseResult.value;
            studentReqIdMap.set(student.id_no, existingReqId);
            successfulUpdateIds.push(existingReqId);
            console.log(`✅ Updated ${student.id_no} -> ${existingReqId}`);
          }
        });

        // Update allStudentRequirements state for successfully updated requirements
        if (successfulUpdateIds.length > 0) {
          setAllStudentRequirements((prev) =>
            prev.map((req) =>
              successfulUpdateIds.includes(req._id || req.id || "")
                ? { ...req, status: "signed" }
                : req
            )
          );
          console.log(
            `✅ Updated ${successfulUpdateIds.length} requirements in state with status: signed`
          );
        }
      }

      // Create new requirements
      let createResults: StudentRequirement[] = [];
      if (studentsToCreate.length > 0) {
        console.log("➕ Creating new requirements...");
        const bulkRequirements = studentsToCreate.map((student) => ({
          studentId: student.id_no,
          coId: user.id,
          requirementId: reqId,
          status: "signed" as const,
        }));

        createResults = await createBulkStudentRequirements(bulkRequirements);

        if (createResults && createResults.length > 0) {
          console.log("📦 Bulk create results:", createResults);

          createResults.forEach((result, index) => {
            const studentIdNo = bulkRequirements[index].studentId;
            const storedId = result._id || result.id || "";
            console.log(`✅ Created ${studentIdNo} -> ${storedId}`);
            studentReqIdMap.set(studentIdNo, storedId);
          });

          // Add new requirements to state
          setAllStudentRequirements((prev) => [...prev, ...createResults]);
        }
      }

      hideLoading();

      const totalProcessed = studentsToUpdate.length + createResults.length;

      if (totalProcessed > 0) {
        // Update local state to reflect the signed status and store student requirement IDs
        setStudentList((prev) =>
          prev.map((student) =>
            selectedStudents.includes(student.id)
              ? {
                  ...student,
                  status: "Signed",
                  studentRequirementId: studentReqIdMap.get(student.id_no),
                }
              : student
          )
        );
        setSelectedStudents([]);
        console.log(
          "✅ Stored student requirement IDs:",
          Array.from(studentReqIdMap.entries())
        );
        message.success(`Successfully signed ${totalProcessed} student(s)`);
      } else {
        message.error("Failed to sign students");
      }
    } catch (error) {
      console.error("Error signing selected students:", error);
      message.error("An error occurred while signing students");
    }
  };

  const handleUndoSelected = () => {
    setConfirmDialog({
      isOpen: true,
      type: "multiple",
      onConfirm: async () => {
        try {
          // Get selected students with their requirement IDs
          const selectedStudentsData = studentList.filter((student) =>
            selectedStudents.includes(student.id)
          );

          // Filter students that have requirement IDs
          const studentsWithReqIds = selectedStudentsData.filter(
            (s) => s.studentRequirementId
          );

          if (studentsWithReqIds.length > 0) {
            const hideLoading = message.loading(
              `Undoing ${studentsWithReqIds.length} signature(s)...`,
              0
            );

            // Update all student requirements in parallel
            const updatePromises = studentsWithReqIds.map((student) =>
              updateStudentRequirement(
                student.studentRequirementId!,
                "incomplete",
                student.id_no,
                user?.id,
                reqId
              )
            );

            const results = await Promise.allSettled(updatePromises);

            hideLoading();

            const successCount = results.filter(
              (r) => r.status === "fulfilled" && r.value !== null
            ).length;
            const failedCount = results.length - successCount;

            // Update allStudentRequirements state for successfully updated students
            const successfulReqIds = studentsWithReqIds
              .filter((_, index) => results[index].status === "fulfilled")
              .map((s) => s.studentRequirementId);

            setAllStudentRequirements((prev) =>
              prev.map((req) =>
                successfulReqIds.includes(req._id || req.id)
                  ? { ...req, status: "incomplete" }
                  : req
              )
            );
            console.log("✅ Updated requirements in state with status: incomplete");

            // Update local state for all selected students
            setStudentList((prev) =>
              prev.map((student) =>
                selectedStudents.includes(student.id)
                  ? {
                      ...student,
                      status: "Incomplete",
                      // Keep the studentRequirementId so we can re-sign later
                      studentRequirementId: student.studentRequirementId,
                    }
                  : student
              )
            );

            if (failedCount > 0) {
              message.warning(
                `Updated ${successCount} signature(s). ${failedCount} failed.`
              );
            } else {
              message.success(
                `Successfully undone ${successCount} signature(s)`
              );
            }
          } else {
            // No requirement IDs found, just update local state
            setStudentList((prev) =>
              prev.map((student) =>
                selectedStudents.includes(student.id)
                  ? { ...student, status: "Incomplete" }
                  : student
              )
            );
            message.success("Status updated locally");
          }

          setSelectedStudents([]);
        } catch (error) {
          console.error("Error undoing selected students:", error);
          message.error("An error occurred while undoing signatures");
        }
        setConfirmDialog({ isOpen: false });
      },
    });
  };

  const handleSignToggle = async (studentId: string) => {
    const student = studentList.find((s) => s.id === studentId);

    if (!student) {
      message.error("Student not found");
      return;
    }

    console.log("Student ID Number:", student.id_no);
    console.log("Clearing Officer ID:", user?.id);
    console.log("Requirement ID:", reqId);

    if (student?.status === "Signed") {
      // If student is already signed, show confirmation to undo
      setConfirmDialog({
        isOpen: true,
        type: "single",
        studentId,
        studentName: student.name,
        onConfirm: async () => {
          try {
            console.log(
              "🔄 Attempting to undo signature for student:",
              student.name
            );
            console.log("👤 Full student object:", student);
            console.log(
              "🔑 Student Requirement ID (_id to use in API):",
              student.studentRequirementId
            );
            console.log("📋 Student ID Number:", student.id_no);
            console.log("📊 Current Status:", student.status);

            // Check if student has a studentRequirementId to update
            if (student.studentRequirementId) {
              const hideLoading = message.loading("Undoing signature...", 0);

              console.log(
                "📤 Sending update request with ID:",
                student.studentRequirementId
              );
              console.log("📤 Additional data - Student ID:", student.id_no);
              console.log("📤 Additional data - CO ID:", user?.id);
              console.log("📤 Additional data - Requirement ID:", reqId);

              // Update the student requirement status to "incomplete"
              const result = await updateStudentRequirement(
                student.studentRequirementId,
                "incomplete",
                student.id_no,
                user?.id,
                reqId
              );

              console.log("📥 Update result:", result);

              hideLoading();

              if (result) {
                // Update allStudentRequirements state
                setAllStudentRequirements((prev) =>
                  prev.map((req) =>
                    (req._id === student.studentRequirementId || req.id === student.studentRequirementId)
                      ? { ...req, status: "incomplete" }
                      : req
                  )
                );
                console.log("✅ Updated requirement in state with status: incomplete");

                // Update local state
                setStudentList((prev) =>
                  prev.map((s) =>
                    s.id === studentId
                      ? {
                          ...s,
                          status: "Incomplete",
                          // Keep the studentRequirementId so we can re-sign later
                          studentRequirementId: student.studentRequirementId,
                        }
                      : s
                  )
                );
                console.log("✅ Local state updated successfully");
                message.success(`${student.name} signature removed`);
              } else {
                console.error("❌ Update returned null");
                message.error("Failed to undo signature");
              }
            } else {
              console.warn(
                "⚠️ No student requirement ID found for student:",
                student.name
              );
              console.log(
                "💡 This might mean the student was never signed in the database"
              );

              // No student requirement ID found, just update local state
              setStudentList((prev) =>
                prev.map((s) =>
                  s.id === studentId ? { ...s, status: "Incomplete" } : s
                )
              );
              message.warning(
                "No database record found. Updated locally only."
              );
            }
          } catch (error) {
            console.error("❌ Error undoing signature:", error);
            message.error("An error occurred while undoing the signature");
          }
          setConfirmDialog({ isOpen: false });
        },
      });
    } else {
      // Sign the student and save to database
      try {
        // Validate required data
        if (!user?.id) {
          message.error("Clearing officer ID not found");
          return;
        }
        if (!reqId) {
          message.error("Requirement ID not found");
          return;
        }
        if (!student.id_no) {
          message.error("Student ID not found");
          return;
        }

        // Check if student requirement already exists
        const existingRequirement = findExistingStudentRequirement(
          allStudentRequirements,
          student.id_no,
          user.id,
          reqId
        );

        console.log("🔍 Checking for existing requirement...");
        console.log("   - Student ID:", student.id_no);
        console.log("   - CO ID:", user.id);
        console.log("   - Requirement ID:", reqId);
        console.log("   - Existing requirement found:", existingRequirement);

        const hideLoading = message.loading("Signing student...", 0);

        let result: StudentRequirement | null = null;
        let storedId: string | undefined;

        if (existingRequirement) {
          // Update existing requirement
          const existingId = existingRequirement._id || existingRequirement.id;
          console.log(
            "♻️ Requirement exists! Updating status to 'signed' for ID:",
            existingId
          );

          result = await updateStudentRequirement(
            existingId!,
            "signed",
            student.id_no,
            user.id,
            reqId
          );

          storedId = existingId;

          // Update the requirement in allStudentRequirements state
          if (result) {
            setAllStudentRequirements((prev) =>
              prev.map((req) =>
                (req._id === existingId || req.id === existingId)
                  ? { ...req, status: "signed" }
                  : req
              )
            );
            console.log("✅ Updated requirement in state with status: signed");
          }
        } else {
          // Create new student requirement
          console.log("➕ No existing requirement found. Creating new one...");

          const requirementData = {
            studentId: student.id_no,
            coId: user.id,
            requirementId: reqId,
            status: "signed" as const,
          };

          console.log("📦 Prepared requirement data:", requirementData);

          result = await createStudentRequirement(requirementData);
          storedId = result?._id || result?.id;

          console.log("📦 Full API response:", result);
          console.log("🔑 Extracted _id:", result?._id);
          console.log("🔑 Extracted id:", result?.id);
          console.log("✅ Will store student requirement ID:", storedId);

          // Add new requirement to state
          if (result) {
            setAllStudentRequirements((prev) => [
              ...prev,
              result as StudentRequirement,
            ]);
          }
        }

        hideLoading();

        if (result) {
          // Update local state to reflect the signed status and store the student requirement ID
          setStudentList((prev) =>
            prev.map((s) =>
              s.id === studentId
                ? {
                    ...s,
                    status: "Signed",
                    studentRequirementId: storedId,
                  }
                : s
            )
          );
          message.success(`${student.name} signed successfully`);
        } else {
          message.error("Failed to sign student");
        }
      } catch (error) {
        console.error("Error signing student:", error);
        message.error("An error occurred while signing the student");
      }
    }
  };

  const handleDialogCancel = () => {
    setConfirmDialog({ isOpen: false });
  };

  const isAllSelected =
    selectedStudents.length > 0 &&
    selectedStudents.length === filteredStudents.length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <ChevronLeft
            className="w-6 h-6 text-slate-600 cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => navigation("/clearing-officer/clearance")}
          />
          <h1 className="text-3xl font-bold text-slate-800">
            Student Records {courseCode}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-md text-muted-foreground">
          <Book className="w-5 h-5 text-primary" />
          <span>{courseCode}</span>
        </div>
      </div>

      <Card className="shadow-gray-100">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[250px]"
                />
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground ml-5">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Signed:{" "}
                  {studentList.filter((s) => s.status === "Signed").length}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Incomplete:{" "}
                  {studentList.filter((s) => s.status === "Incomplete").length}
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Missing:{" "}
                  {studentList.filter((s) => s.status === "Missing").length}
                </span>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[180px] sm:ml-auto">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!courseCode ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <PackageX className="w-24 h-24 text-gray-300" />
              <div className="space-y-1 text-center">
                <p className="text-gray-400 text-2xl font-semibold">
                  No Course Code Provided
                </p>
                <p className="text-gray-400 text-sm">
                  Please navigate to this page from the Requirements table.
                </p>
                <Button
                  onClick={() => navigation("/clearing-officer/clearance")}
                  className="mt-4"
                >
                  Go to Clearance Page
                </Button>
              </div>
            </div>
          ) : isLoadingStudents ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
              <span className="ml-3 text-gray-600">Loading students...</span>
            </div>
          ) : (
            <>
              {selectedStudents.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    size="sm"
                    onClick={handleSignSelected}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Sign Selected ({selectedStudents.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleUndoSelected}
                  >
                    <Undo className="w-4 h-4 mr-2" />
                    Undo Selected ({selectedStudents.length})
                  </Button>
                </div>
              )}
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <TooltipDemo isSelected={isAllSelected}>
                          <Checkbox
                            className="border border-blue-600 hover:border-blue-700 hover:border-2"
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all"
                          />
                        </TooltipDemo>
                      </TableHead>
                      <TableHead className="font-semibold">Student</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">
                        ID Number
                      </TableHead>
                      <TableHead className="hidden lg:table-cell font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">
                        Phone
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.length > 0 ? (
                      paginatedStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox
                              className="border border-blue-600 hover:border-blue-700 hover:border-2"
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={(checked) =>
                                handleSelectStudent(student.id, !!checked)
                              }
                              aria-label={`Select ${student.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={student.profilePic}
                                  alt={student.name}
                                />
                                <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                  {student.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {student.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <IdCard className="w-4 h-4 text-muted-foreground" />
                              {student.id_no}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span
                                className={
                                  student.email === "N/A"
                                    ? "text-gray-400 italic"
                                    : ""
                                }
                              >
                                {student.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span
                                className={
                                  student.cp_no === "N/A"
                                    ? "text-gray-400 italic"
                                    : ""
                                }
                              >
                                {student.cp_no}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${
                                student.status === "Signed"
                                  ? "bg-green-100 border border-green-300 text-green-600"
                                  : student.status === "Incomplete"
                                  ? "bg-yellow-100 border border-yellow-300 text-yellow-600"
                                  : "bg-red-100 border border-red-300 text-red-600"
                              }`}
                            >
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="">
                            <div className="flex items-center gap-2">
                              <Button
                                className="w-20"
                                variant={
                                  student.status === "Signed"
                                    ? "destructive"
                                    : "success"
                                }
                                size="sm"
                                onClick={() => handleSignToggle(student.id)}
                              >
                                {student.status === "Signed" ? (
                                  <Undo className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                {student.status === "Signed" ? "Undo" : "Sign"}
                              </Button>
                              <Link to="/clearing-officer/viewClearance">
                                <Button
                                  className="bg-yellow-500 hover:bg-yellow-400 w-20"
                                  size="sm"
                                >
                                  <Book className="w-4 h-4" />
                                  View
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-64 text-center">
                          <div className="flex flex-col items-center gap-3 py-10">
                            <PackageX className="w-24 h-24 text-gray-300" />
                            <div className="space-y-1">
                              <p className="text-gray-400 text-2xl font-semibold">
                                {fetchError
                                  ? "No Students Enrolled"
                                  : "No students found"}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {fetchError
                                  ? fetchError
                                  : "No students match your search criteria."}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredStudents.length > 0 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      Showing{" "}
                      {Math.min(
                        (currentPage - 1) * studentsPerPage + 1,
                        filteredStudents.length
                      )}{" "}
                      to{" "}
                      {Math.min(
                        currentPage * studentsPerPage,
                        filteredStudents.length
                      )}{" "}
                      of {filteredStudents.length} students
                    </p>
                  </div>
                  <div>
                    <PaginationComponent
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={handleDialogCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Undo Action</DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "single" && confirmDialog.studentName
                ? `Are you sure you want to undo the clearance for ${confirmDialog.studentName}? This action will change their status to "Incomplete".`
                : `Are you sure you want to undo the clearance for ${selectedStudents.length} selected student(s)? This action will change their status to "Incomplete".`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDialog.onConfirm as () => void}
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo Clearance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentRecord;
