import { useState, useMemo } from "react";
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

// Student interface based on the existing student slice
interface Student {
  id: number;
  id_no: string;
  name: string;
  email: string;
  cp_no: string;
  profilePic: string;
  status: "Signed" | "Incomplete" | "Missing";
}

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: 1,
    id_no: "24-0334",
    name: "John Doe",
    email: "johndoe@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "Signed",
  },
  {
    id: 2,
    id_no: "20-0842",
    name: "Jane Smith",
    email: "janesmith@example.com",
    cp_no: "09234567890",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "Incomplete",
  },
  {
    id: 3,
    id_no: "24-0335",
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    cp_no: "09345678901",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    status: "Signed",
  },
  {
    id: 4,
    id_no: "24-0336",
    name: "Bob Brown",
    email: "bobbrown@example.com",
    cp_no: "09456789012",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "Missing",
  },
  {
    id: 5,
    id_no: "23-0441",
    name: "Charlie Davis",
    email: "charliedavis@example.com",
    cp_no: "09567890123",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
    status: "Signed",
  },
  {
    id: 6,
    id_no: "22-0558",
    name: "Diana Prince",
    email: "dianaprince@example.com",
    cp_no: "09678901234",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
    status: "Incomplete",
  },
  {
    id: 7,
    id_no: "24-0337",
    name: "Edward Norton",
    email: "ednorton@example.com",
    cp_no: "09789012345",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
    status: "Signed",
  },
  {
    id: 8,
    id_no: "21-0882",
    name: "Fiona Apple",
    email: "fionaapple@example.com",
    cp_no: "09890123456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg",
    status: "Missing",
  },
  {
    id: 9,
    id_no: "24-0338",
    name: "George Martin",
    email: "georgemartin@example.com",
    cp_no: "09901234567",
    profilePic: "https://randomuser.me/api/portraits/men/9.jpg",
    status: "Signed",
  },
  {
    id: 10,
    id_no: "23-0662",
    name: "Hannah Montana",
    email: "hannahmontana@example.com",
    cp_no: "09012345678",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
    status: "Incomplete",
  },
  {
    id: 11,
    id_no: "23-0662",
    name: "Hannah Montana",
    email: "hannahmontana@example.com",
    cp_no: "09012345678",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
    status: "Incomplete",
  },
];

export const SaoOfficer = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Status badge styling helper
  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "Signed":
        return (
          <Badge className="bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20">
            <UserCheck className="mr-1 h-3 w-3" />
            Signed
          </Badge>
        );
      case "Incomplete":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 hover:bg-yellow-500/20">
            <Filter className="mr-1 h-3 w-3" />
            Incomplete
          </Badge>
        );
      case "Missing":
        return (
          <Badge className="bg-red-500/10 text-red-700 border-red-500/20 hover:bg-red-500/20">
            <UserX className="mr-1 h-3 w-3" />
            Missing
          </Badge>
        );
      default:
        return null;
    }
  };

  // Filtered and paginated data
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        student.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredStudents.length,
      signed: filteredStudents.filter((s) => s.status === "Signed").length,
      incomplete: filteredStudents.filter((s) => s.status === "Incomplete")
        .length,
      missing: filteredStudents.filter((s) => s.status === "Missing").length,
    };
  }, [filteredStudents]);

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student List</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all students in the system
          </p>
        </div>
        <Button className="w-fit">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Statistics Cards */}
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

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                A comprehensive list of all registered students
              </CardDescription>
            </div>
            {/* Search and Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
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
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">ID No.</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="w-[130px]">Status</TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id} className="group">
                      <TableCell className="font-medium">
                        {student.id_no}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={student.profilePic}
                            alt={student.name}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
                          />
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.cp_no}
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 mt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
              </span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-20" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm font-medium">{currentPage}</span>
                <span className="text-sm text-muted-foreground">of</span>
                <span className="text-sm font-medium">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
