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
import { Spin } from "antd";
import {
  getAllStudentSpecificSubject,
  getMultipleStudentsBySchoolIds,
} from "@/services/intigration.services";

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
  id: number;
  name: string;
  email: string;
  id_no: string;
  cp_no: string;
  profilePic: string;
  status: string;
  initials: string;
}

interface ConfirmDialog {
  isOpen: boolean;
  type?: "single" | "multiple";
  studentId?: number;
  studentName?: string;
  onConfirm?: () => void;
}

const StudentRecord: React.FC = () => {
  const navigation = useNavigate();
  const { courseCode } = useParams<{
    courseCode: string;
  }>();

  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
    isOpen: false,
  });
  const [fetchError, setFetchError] = useState<string | null>(null);

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
          (student: ApiStudentData, index: number) => {
            const fullName = `${student.firstName || ""} ${
              student.lastName || ""
            }`.trim();
            const initials = `${student.firstName?.charAt(0) || ""}${
              student.lastName?.charAt(0) || ""
            }`.toUpperCase();

            return {
              id: index + 1,
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

        setStudentList(transformedStudents);
        console.log(
          `Fetched and transformed ${transformedStudents.length} students for course ${courseCode}`
        );
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
  }, [courseCode]);

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

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    setSelectedStudents((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId)
    );
  };

  const handleSignSelected = () => {
    setStudentList((prev) =>
      prev.map((student) =>
        selectedStudents.includes(student.id)
          ? { ...student, status: "Signed" }
          : student
      )
    );
    setSelectedStudents([]);
  };

  const handleUndoSelected = () => {
    setConfirmDialog({
      isOpen: true,
      type: "multiple",
      onConfirm: () => {
        setStudentList((prev) =>
          prev.map((student) =>
            selectedStudents.includes(student.id)
              ? { ...student, status: "Incomplete" }
              : student
          )
        );
        setSelectedStudents([]);
        setConfirmDialog({ isOpen: false });
      },
    });
  };

  const handleSignToggle = (studentId: number) => {
    const student = studentList.find((s) => s.id === studentId);
    if (student?.status === "Signed") {
      setConfirmDialog({
        isOpen: true,
        type: "single",
        studentId,
        studentName: student.name,
        onConfirm: () => {
          setStudentList((prev) =>
            prev.map((s) =>
              s.id === studentId
                ? {
                    ...s,
                    status: s.status === "Signed" ? "Incomplete" : "Signed",
                  }
                : s
            )
          );
          setConfirmDialog({ isOpen: false });
        },
      });
    } else {
      setStudentList((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, status: s.status === "Signed" ? "Incomplete" : "Signed" }
            : s
        )
      );
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
