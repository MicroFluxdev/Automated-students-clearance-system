import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  Loader2,
  IdCard,
  Search,
  X,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/services/studentService";
import type {
  Student,
  CreateStudentPayload,
  UpdateStudentPayload,
  YearLevel,
} from "@/services/studentService";

/**
 * Form data interface for the student form
 */
interface StudentFormData {
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  program: string;
  yearLevel: YearLevel;
  password: string;
}

/**
 * Initial empty form state
 */
const initialFormData: StudentFormData = {
  schoolId: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  program: "",
  yearLevel: "1st Year",
  password: "",
};

/**
 * Modal modes
 */
type ModalMode = "add" | "edit";

/**
 * Available programs
 */
const programs = [
  "Computer Science",
  "Information Technology",
  "Computer Engineering",
  "Information Systems",
  "Software Engineering",
  "Data Science",
  "Cybersecurity",
];

/**
 * Available year levels
 */
const yearLevels: YearLevel[] = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
];

const AddStudents = () => {
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof StudentFormData, string>>
  >({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const { toast } = useToast();

  /**
   * Fetch all students on component mount
   */
  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllStudents();
      console.log("Fetched students:", data);

      // Sort students in descending order (newest first)
      const sortedData = data.sort((a, b) => {
        // Sort by createdAt if available, otherwise by _id
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        // Fallback to _id comparison (assuming MongoDB ObjectId which contains timestamp)
        return b._id.localeCompare(a._id);
      });

      setStudents(sortedData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to load students: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /**
   * Filter students based on search query
   */
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) {
      return students;
    }

    const query = searchQuery.toLowerCase().trim();
    return students.filter(
      (student) =>
        student.schoolId.toLowerCase().includes(query) ||
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(query) ||
        student.email.toLowerCase().includes(query) ||
        (student.phoneNumber && student.phoneNumber.includes(query)) ||
        student.program.toLowerCase().includes(query) ||
        student.yearLevel.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  /**
   * Handle search query change
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  /**
   * Clear search query
   */
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page when clearing search
  }, []);

  /**
   * Pagination calculations
   */
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = useMemo(
    () => filteredStudents.slice(startIndex, endIndex),
    [filteredStudents, startIndex, endIndex]
  );

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Go to first page
   */
  const handleFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  /**
   * Go to last page
   */
  const handleLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  /**
   * Validate form fields
   */
  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof StudentFormData, string>> = {};

    // School ID validation
    if (!formData.schoolId.trim()) {
      errors.schoolId = "School ID is required";
    }

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Invalid phone number (10-15 digits)";
    }

    // Program validation
    if (!formData.program.trim()) {
      errors.program = "Program is required";
    }

    // Year level validation
    if (!formData.yearLevel) {
      errors.yearLevel = "Year level is required";
    }

    // Password validation (only for add mode)
    if (modalMode === "add") {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, modalMode]);

  /**
   * Handle opening modal for adding new student
   */
  const handleOpenAddModal = useCallback(() => {
    setModalMode("add");
    setFormData(initialFormData);
    setFormErrors({});
    setEditingStudent(null);
    setIsModalOpen(true);
  }, []);

  /**
   * Handle opening modal for editing student
   */
  const handleOpenEditModal = useCallback(
    (student: Student) => {
      // Validate that student has an ID
      if (!student._id) {
        console.error("Student object missing _id:", student);
        toast({
          title: "Error",
          description: "Cannot edit student: Missing ID",
          variant: "destructive",
        });
        return;
      }

      console.log("Editing student:", student);
      setModalMode("edit");
      setFormData({
        schoolId: student.schoolId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        program: student.program,
        yearLevel: student.yearLevel,
        password: "", // Password not needed for edit
      });
      setFormErrors({});
      setEditingStudent(student);
      setIsModalOpen(true);
    },
    [toast]
  );

  /**
   * Handle closing modal
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setFormErrors({});
    setEditingStudent(null);
  }, []);

  /**
   * Handle form field changes
   */
  const handleInputChange = useCallback(
    (field: keyof StudentFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formErrors]
  );

  /**
   * Handle form submission for add/edit
   */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (modalMode === "add") {
        // Create new student
        const payload: CreateStudentPayload = {
          schoolId: formData.schoolId.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phoneNumber.trim(),
          program: formData.program.trim(),
          yearLevel: formData.yearLevel,
          password: formData.password,
        };

        console.log("Submitting create payload:", payload);
        await createStudent(payload);
        toast({
          title: "Success",
          description: "Student created successfully",
        });
      } else {
        // Update existing student
        if (!editingStudent) {
          toast({
            title: "Error",
            description: "No student selected for editing",
            variant: "destructive",
          });
          return;
        }

        if (!editingStudent._id) {
          console.error("Editing student missing _id:", editingStudent);
          toast({
            title: "Error",
            description: "Cannot update student: Missing ID",
            variant: "destructive",
          });
          return;
        }

        console.log("Updating student with ID:", editingStudent._id);

        const payload: UpdateStudentPayload = {
          schoolId: formData.schoolId.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phoneNumber.trim(),
          program: formData.program.trim(),
          yearLevel: formData.yearLevel,
        };

        await updateStudent(editingStudent._id, payload);
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      }

      // Refresh the list
      await fetchStudents();
      handleCloseModal();
    } catch (error: unknown) {
      console.error("Submit error:", error);

      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === "object" && "response" in error) {
        // Handle axios error
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
              error?: string;
              errors?: Record<string, string[]>;
            };
          };
        };
        const responseData = axiosError.response?.data;

        // Check for validation errors object
        if (responseData?.errors) {
          const validationErrors = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("; ");
          errorMessage = validationErrors;
        } else {
          errorMessage =
            responseData?.message ||
            responseData?.error ||
            "Unknown error occurred";
        }
      }

      toast({
        title: "Error",
        description: `Failed to ${
          modalMode === "add" ? "create" : "update"
        } student: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateForm,
    modalMode,
    formData,
    editingStudent,
    toast,
    fetchStudents,
    handleCloseModal,
  ]);

  /**
   * Handle opening delete confirmation dialog
   */
  const handleOpenDeleteDialog = useCallback((id: string, name: string) => {
    setStudentToDelete({ id, name });
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle closing delete confirmation dialog
   */
  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  }, []);

  /**
   * Handle confirming deletion
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!studentToDelete) return;

    try {
      setIsDeleting(studentToDelete.id);
      await deleteStudent(studentToDelete.id);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      await fetchStudents();
      handleCloseDeleteDialog();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to delete student: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  }, [studentToDelete, toast, fetchStudents, handleCloseDeleteDialog]);

  /**
   * Memoized table rows for performance
   */
  const tableRows = useMemo(
    () =>
      paginatedStudents.map((student) => (
        <TableRow key={student._id}>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-blue-500" />
              <span className="hidden sm:inline">{student.schoolId}</span>
              <span className="sm:hidden text-xs">{student.schoolId}</span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-500" />
              <div className="flex flex-col">
                <span className="font-medium">
                  {student.firstName} {student.lastName}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-500" />
              <span className="text-sm">{student.email}</span>
            </div>
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-orange-500" />
              <span className="text-sm">
                {student.phoneNumber || "Not provided"}
              </span>
            </div>
          </TableCell>
          <TableCell className="hidden xl:table-cell">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <span className="text-sm">{student.program}</span>
            </div>
          </TableCell>
          <TableCell className="hidden 2xl:table-cell">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-pink-500" />
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  student.yearLevel === "1st Year"
                    ? "bg-green-100 text-green-800"
                    : student.yearLevel === "2nd Year"
                    ? "bg-blue-100 text-blue-800"
                    : student.yearLevel === "3rd Year"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {student.yearLevel}
              </span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEditModal(student)}
                disabled={isSubmitting || isDeleting !== null}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Edit</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  handleOpenDeleteDialog(
                    student._id,
                    `${student.firstName} ${student.lastName}`
                  )
                }
                disabled={isSubmitting || isDeleting !== null}
              >
                {isDeleting === student._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="hidden sm:inline ml-1">Delete</span>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )),
    [
      paginatedStudents,
      isSubmitting,
      isDeleting,
      handleOpenEditModal,
      handleOpenDeleteDialog,
    ]
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            Student Management
          </h1>
          <p className="text-slate-600 mt-1">
            Add and manage students in the system
          </p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Student
        </Button>
      </div>

      {/* Table Section */}
      <Card className="p-6">
        {/* Search Section */}
        <div className="flex items-center gap-2 mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, school ID, email, phone, or program..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="text-sm text-slate-600">
              Found {filteredStudents.length} of {students.length} students
            </div>
          )}
        </div>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-slate-600">Loading students...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <User className="h-16 w-16 mb-4 opacity-30" />
              {students.length === 0 ? (
                <>
                  <p className="text-lg font-medium">No students found</p>
                  <p className="text-sm mt-1">
                    Click "Add New Student" to create one
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">
                    No students match your search
                  </p>
                  <p className="text-sm mt-1">
                    Try adjusting your search query
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSearch}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">School ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Phone
                      </TableHead>
                      <TableHead className="hidden xl:table-cell">
                        Program
                      </TableHead>
                      <TableHead className="hidden 2xl:table-cell">
                        Year Level
                      </TableHead>
                      <TableHead className="w-[200px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>{tableRows}</TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && filteredStudents.length > 0 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-slate-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis
                      const prevPage = array[index - 1];
                      const showEllipsisBefore =
                        prevPage && page - prevPage > 1;

                      return (
                        <div key={page} className="flex items-center gap-1">
                          {showEllipsisBefore && (
                            <span className="px-2 text-slate-400">...</span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="min-w-[2.5rem]"
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
          key={editingStudent?._id || "new"} // Force re-render when editing different students
        >
          <DialogHeader>
            <DialogTitle>
              {modalMode === "add" ? "Add New Student" : "Edit Student"}
            </DialogTitle>
            <DialogDescription>
              {modalMode === "add"
                ? "Fill in the details to create a new student account."
                : "Update the student information below."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* School ID */}
            <div className="space-y-2">
              <Label htmlFor="schoolId">
                School ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="schoolId"
                placeholder="e.g., 2024-001234"
                value={formData.schoolId}
                onChange={(e) => handleInputChange("schoolId", e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.schoolId && (
                <p className="text-sm text-red-500">{formErrors.schoolId}</p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.firstName && (
                <p className="text-sm text-red-500">{formErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.lastName && (
                <p className="text-sm text-red-500">{formErrors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isSubmitting}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="1234567890"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                disabled={isSubmitting}
              />
              {formErrors.phoneNumber && (
                <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
              )}
            </div>

            {/* Program */}
            <div className="space-y-2">
              <Label htmlFor="program">
                Program <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`program-${editingStudent?._id || "new"}`}
                value={formData.program || undefined}
                onValueChange={(value) => handleInputChange("program", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="program">
                  <SelectValue placeholder="Select a program">
                    {formData.program || "Select a program"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.program && (
                <p className="text-sm text-red-500">{formErrors.program}</p>
              )}
            </div>

            {/* Year Level */}
            <div className="space-y-2">
              <Label htmlFor="yearLevel">
                Year Level <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`yearLevel-${editingStudent?._id || "new"}`}
                value={formData.yearLevel}
                onValueChange={(value) =>
                  handleInputChange("yearLevel", value as YearLevel)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="yearLevel">
                  <SelectValue placeholder="Select year level">
                    {formData.yearLevel || "Select year level"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {yearLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.yearLevel && (
                <p className="text-sm text-red-500">{formErrors.yearLevel}</p>
              )}
            </div>

            {/* Password (only for add mode) */}
            {modalMode === "add" && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {modalMode === "add" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>{modalMode === "add" ? "Create Student" : "Update Student"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-slate-900">
                {studentToDelete?.name}
              </span>
              . This action cannot be undone and will remove all associated data
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting !== null}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting === studentToDelete?.id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Student"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddStudents;
