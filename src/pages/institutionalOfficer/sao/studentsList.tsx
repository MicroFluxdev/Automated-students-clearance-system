import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserCheck,
  UserX,
  Users,
  CheckCircle2,
  Undo2,
  Phone,
  Mail,
  Building,
  Calendar,
  Loader2,
} from "lucide-react";
import axiosInstance, { API_URL } from "@/api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import TooltipDemo from "@/components/HoverToolip";

// API response interface matching the backend data structure
interface ApiStudent {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  yearLevel: string;
  department: string;
}

// Internal interface for UI state management
interface Student {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  yearLevel: string;
  status: "Signed" | "Incomplete" | "Missing";
}

export const SaoOfficer = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch students data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          `${API_URL}/intigration/getAllStudentComparedByIds`
        );

        console.log("API Response:", response.data); // Debug log

        // Handle different response structures
        let studentsData: ApiStudent[] = [];

        if (Array.isArray(response.data)) {
          studentsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          studentsData = response.data.data;
        } else if (response.data && Array.isArray(response.data.students)) {
          studentsData = response.data.students;
        } else {
          throw new Error(
            "Invalid response format: expected an array of students"
          );
        }

        // Transform API data to match Student interface with default status
        const transformedStudents: Student[] = studentsData.map(
          (apiStudent) => ({
            id: apiStudent.id,
            schoolId: apiStudent.schoolId,
            firstName: apiStudent.firstName,
            lastName: apiStudent.lastName,
            email: apiStudent.email,
            phone: apiStudent.phone,
            department: apiStudent.department,
            yearLevel: apiStudent.yearLevel,
            status: "Incomplete", // Default status, can be updated based on business logic
          })
        );

        setStudents(transformedStudents);
      } catch (err) {
        setError("Failed to fetch students data. Please try again later.");
        console.error("Error fetching students:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`;
      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.schoolId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        student.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  useEffect(() => {
    // Reset page when filter/search changes
    setCurrentPage(1);
  }, [searchQuery, statusFilter, itemsPerPage]);

  const stats = useMemo(() => {
    return {
      total: filteredStudents.length,
      signed: filteredStudents.filter((s) => s.status === "Signed").length,
      incomplete: filteredStudents.filter((s) => s.status === "Incomplete")
        .length,
      missing: filteredStudents.filter((s) => s.status === "Missing").length,
    };
  }, [filteredStudents]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSign = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "Signed" ? "Incomplete" : ("Signed" as const),
            }
          : s
      )
    );
  };

  const handleBulkSign = (sign: boolean) => {
    setStudents((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id)
          ? { ...s, status: sign ? "Signed" : "Incomplete" }
          : s
      )
    );
    setSelectedIds([]);
  };

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "Signed":
        return (
          <Badge className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20">
            <UserCheck className="mr-1 h-3 w-3" /> Signed
          </Badge>
        );
      case "Incomplete":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 hover:bg-yellow-500/20">
            <Filter className="mr-1 h-3 w-3" /> Incomplete
          </Badge>
        );
      case "Missing":
        return (
          <Badge className="bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20">
            <UserX className="mr-1 h-3 w-3" /> Missing
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student List </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all students in the system
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 " />
            <span className="text-sm">1st Semester AY 2023–2024</span>
          </div>
        </div>
        <Button className="w-fit">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Students</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              {stats.total}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Signed</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              {stats.signed}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Incomplete</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Filter className="h-5 w-5 text-yellow-600" />
              {stats.incomplete}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Missing</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <UserX className="h-5 w-5 text-red-600" />
              {stats.missing}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                A comprehensive list of all registered students
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v)}
              >
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-muted/50 p-3 rounded-md">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleBulkSign(true)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Sign All
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkSign(false)}
                >
                  <Undo2 className="h-4 w-4 mr-1" /> Undo All
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading students...
              </span>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-16">
              <UserX className="h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive font-medium">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : (
            /* Table Content */
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[40px] text-center">
                        <TooltipDemo
                          isSelected={
                            selectedIds.length === paginatedStudents.length &&
                            paginatedStudents.length > 0
                          }
                        >
                          <Checkbox
                            className="border border-blue-600 hover:border-blue-700 hover:border-2"
                            checked={
                              selectedIds.length === paginatedStudents.length &&
                              paginatedStudents.length > 0
                            }
                            onCheckedChange={(checked) =>
                              toggleSelectAll(checked as boolean)
                            }
                          />
                        </TooltipDemo>
                      </TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Contact
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Department / Year level
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No students found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedStudents.map((student) => (
                        <TableRow key={student.id} className="group">
                          <TableCell className="text-center">
                            <Checkbox
                              className="border border-blue-600 hover:border-blue-700 hover:border-2"
                              checked={selectedIds.includes(student.id)}
                              onCheckedChange={() => toggleSelect(student.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold ring-2 ring-background">
                                {student.firstName.charAt(0)}
                                {student.lastName.charAt(0)}
                              </div>
                              <div className="flex flex-col justify-center ">
                                <span>
                                  {student.firstName} {student.lastName}
                                </span>
                                <span className="text-muted-foreground">
                                  {student.schoolId}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden lg:table-cell">
                            <div className="flex flex-col justify-center gap-1">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm">{student.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span className="text-sm">{student.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden lg:table-cell">
                            <div className="flex flex-col justify-center gap-1">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <span className="text-sm">
                                  {student.department}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm">
                                  {student.yearLevel}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            {getStatusBadge(student.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex  gap-2">
                              <Button
                                className="w-[100px]"
                                size="sm"
                                variant={
                                  student.status === "Signed"
                                    ? "destructive"
                                    : "default"
                                }
                                onClick={() => handleSign(student.id)}
                              >
                                {student.status === "Signed" ? (
                                  <>
                                    <Undo2 className="h-4 w-4 mr-1" /> Cancel
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-1" />{" "}
                                    Sign
                                  </>
                                )}
                              </Button>
                              <Button
                                className="bg-yellow-500 hover:bg-yellow-600"
                                size="sm"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{startIndex + 1}</span>–
                  <span className="font-medium">
                    {Math.min(endIndex, filteredStudents.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredStudents.length}</span>{" "}
                  students
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages || 1}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>

                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(v) => {
                      setItemsPerPage(Number(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[90px]">
                      <SelectValue placeholder="Rows" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}/page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
