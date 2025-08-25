import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  IdCard,
  ArrowLeft,
  Download,
  Printer,
  GraduationCap,
  Calendar,
  CalendarCheck2,
  FileChartLine,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ClearanceItem {
  id: number;
  department: string;
  status: "Cleared" | "Pending" | "Missing";
  requirements: string;
  clearedBy: string;
  clearedAt: string;
}

interface Student {
  id: number;
  id_no: string;
  name: string;
  email: string;
  cp_no: string;
  profilePic: string;
  course: string;
  year: string;
}

// Replace with real backend data as needed
const student: Student = {
  id: 1,
  id_no: "24-0334",
  name: "John Doe",
  email: "johndoe@example.com",
  cp_no: "09123456789",
  profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  course: "Bachelor of Science in Computer Science",
  year: "4th Year",
};

const DeptClearance: ClearanceItem[] = [
  {
    id: 1,
    department: "CC107",
    status: "Cleared",
    requirements: "Log in System",
    clearedBy: "Apple Shyne Liup",
    clearedAt: "2024-03-15 10:30 AM",
  },
  {
    id: 2,
    department: "SE102",
    status: "Pending",
    requirements: "Inventory Management System",
    clearedBy: "Eurie Gie ",
    clearedAt: "-",
  },
  {
    id: 3,
    department: "IS101",
    status: "Cleared",
    requirements: "AI Chatbot",
    clearedBy: "Apple Shyne Liup",
    clearedAt: "2024-03-14 02:15 PM",
  },
  {
    id: 4,
    department: "GEC 9",
    status: "Missing",
    requirements: "Dance performance",
    clearedBy: "Sarah Wilson",
    clearedAt: "2024-03-13 11:45 AM",
  },
];

const InstClearance: ClearanceItem[] = [
  {
    id: 1,
    department: "Library",
    status: "Cleared",
    requirements: "All books returned",
    clearedBy: "Jane Smith",
    clearedAt: "2024-03-15 10:30 AM",
  },
  {
    id: 2,
    department: "Registrar",
    status: "Missing",
    requirements: "Form 137",
    clearedBy: "-",
    clearedAt: "-",
  },
  {
    id: 3,
    department: "Finance",
    status: "Cleared",
    requirements: "All fees paid",
    clearedBy: "Mike Johnson",
    clearedAt: "2024-03-14 02:15 PM",
  },
  {
    id: 4,
    department: "SAO",
    status: "Pending",
    requirements: "Note Book and Folder",
    clearedBy: "Christina Abella",
    clearedAt: "-",
  },
];

export const ViewClearance = () => {
  const getStatusColor = (status: ClearanceItem["status"]) => {
    switch (status) {
      case "Cleared":
        return "text-green-600 border-green-600";
      case "Pending":
        return "text-yellow-600 border-yellow-600";
      case "Missing":
        return "text-red-600 border-red-600";
      default:
        return "text-gray-600 border-gray-600";
    }
  };

  const schoolYear = "2024-2025 2nd Semester";

  return (
    <div className="mx-auto p-4 md:px-10 lg:px-30 space-y-6 bg-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/clearing-officer/student-records">
            <Button className="flex items-center gap-2 bg-blue-500 text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Records
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">Student Clearance</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button className="flex items-center gap-2 bg-blue-500 text-white">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-500 text-white"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Student Info */}
      <Card className="border-none bg-white shadow-md">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h2 className="text-lg md:text-xl font-semibold">
            Student Information
          </h2>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{schoolYear}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={student.profilePic}
              alt={student.name}
              className="w-24 h-24 rounded-full border border-gray-300 object-cover"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {/* Left Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IdCard className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">ID Number:</span>
                  <span className="font-medium">{student.id_no}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{student.cp_no}</span>
                </div>
              </div>

              {/* Right Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Course:</span>
                  <p className="font-medium">{student.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Year Level:</span>
                  <p className="font-medium">{student.year}</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <FileChartLine className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600">Clearance Status:</span>
                  <div className="flex justify-center items-center gap-2 bg-red-100 border border-red-300 text-red-800 px-5 py-2 rounded-2xl">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold">Incomplete</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clearance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Department Clearance */}
        <Card className="border-none bg-white shadow-md">
          <CardHeader>
            <h2 className="text-lg md:text-xl font-semibold">
              Department Clearance
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {DeptClearance.map((item, index) => (
              <div key={item.id}>
                <div className="flex flex-col md:flex-row justify-between py-2 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                      {item.status === "Cleared" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : item.status === "Missing" ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.department}</h3>
                      <p className="text-sm text-gray-500">
                        Requirements: {item.requirements}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                    {item.clearedBy !== "-" && (
                      <p className="text-sm text-gray-500">
                        Cleared by: {item.clearedBy}
                      </p>
                    )}
                    {item.clearedAt !== "-" && (
                      <p className="text-sm text-gray-500">{item.clearedAt}</p>
                    )}
                  </div>
                </div>
                {index < DeptClearance.length - 1 && (
                  <hr className="my-3 border-t border-gray-300" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Institution Clearance */}
        <Card className="border-none bg-white shadow-md">
          <CardHeader>
            <h2 className="text-lg md:text-xl font-semibold">
              Institution Clearance
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {InstClearance.map((item, index) => (
              <div key={item.id}>
                <div className="flex flex-col md:flex-row justify-between py-2 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                      {item.status === "Cleared" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : item.status === "Missing" ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-yellow-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.department}</h3>
                      <p className="text-sm text-gray-500">
                        Requirements: {item.requirements}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                    {item.clearedBy !== "-" && (
                      <p className="text-sm text-gray-500">
                        Cleared by: {item.clearedBy}
                      </p>
                    )}
                    {item.clearedAt !== "-" && (
                      <p className="text-sm text-gray-500">{item.clearedAt}</p>
                    )}
                  </div>
                </div>
                {index < InstClearance.length - 1 && (
                  <hr className="my-3 border-t border-gray-300" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewClearance;
