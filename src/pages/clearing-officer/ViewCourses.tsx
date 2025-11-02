import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Calendar,
  GraduationCap,
  MapPin,
} from "lucide-react";
import axiosInstance, { API_URL } from "@/api/axios";
import { useAuth } from "@/authentication/useAuth";
import { message } from "antd";
import axios from "axios";
import SkeletonCardLoading from "./_components/SkeletonCardLoading";
import SkeletonStatLoading from "./_components/SkeletonStatLoading";

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  schedules: Array<{
    day: string;
    timeStart: string;
    timeEnd: string;
    room: string;
    instructor: string;
  }>;
  units: number;
  departments: string[];
  semester: string;
  yearLevel: string;
  description?: string;
}

const ViewCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYearLevel, setSelectedYearLevel] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // Fetch all courses by schoolId
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.schoolId) {
        return;
      }

      setLoading(true);
      try {
        const schoolId = user?.schoolId;
        const encodedSchoolId = encodeURIComponent(schoolId);

        console.log(
          "Fetching courses for:",
          schoolId,
          "| Encoded:",
          encodedSchoolId
        );
        // Using axiosInstance with the integration endpoint
        const response = await axiosInstance.get(
          `${API_URL}/intigration/getCoursesBySchoolId/${encodedSchoolId}`
        );

        // Extract the courses array from the response
        const coursesData = response.data?.courses || [];
        console.log("Fetched courses:", coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        const errorMessage =
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Failed to fetch courses";
        message.error(errorMessage);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.schoolId]);

  // Extract unique departments, year levels, and semesters for filters
  const departments = [
    "all",
    ...Array.from(
      new Set(courses.flatMap((course) => course.departments || []))
    ),
  ];
  const yearLevels = [
    "all",
    ...Array.from(new Set(courses.map((course) => course.yearLevel))),
  ];
  const semesters = [
    "all",
    ...Array.from(new Set(courses.map((course) => course.semester))),
  ];

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      course.courseName.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" ||
      course.departments?.includes(selectedDepartment);

    const matchesYearLevel =
      selectedYearLevel === "all" || course.yearLevel === selectedYearLevel;

    const matchesSemester =
      selectedSemester === "all" || course.semester === selectedSemester;

    return (
      matchesSearch && matchesDepartment && matchesYearLevel && matchesSemester
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              All Courses
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Browse and explore your all available courses
            </p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? (
            <>
              <SkeletonStatLoading />
              <SkeletonStatLoading />
              <SkeletonStatLoading />
              <SkeletonStatLoading />
            </>
          ) : (
            <>
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        Total Courses
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {courses.length}
                      </p>
                    </div>
                    <BookOpen className="h-12 w-12 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">
                        Departments
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {departments.length - 1}
                      </p>
                    </div>
                    <Users className="h-12 w-12 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">
                        Year Levels
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {yearLevels.length - 1}
                      </p>
                    </div>
                    <GraduationCap className="h-12 w-12 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">
                        Filtered Results
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {filteredCourses.length}
                      </p>
                    </div>
                    <Search className="h-12 w-12 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>

              {/* Department Filter */}
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Level Filter */}
              <Select
                value={selectedYearLevel}
                onValueChange={setSelectedYearLevel}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by year level" />
                </SelectTrigger>
                <SelectContent>
                  {yearLevels.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "all" ? "All Year Levels" : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Semester Filter */}
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      {sem === "all" ? "All Semesters" : sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCardLoading key={index} />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              No Courses Found
            </h2>
            <p className="mt-2 text-gray-500">
              {courses.length === 0
                ? "No courses available at the moment."
                : "Adjust your search or filters to find courses."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">
                          {course.courseCode}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {course.units} units
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3 text-sm font-semibold text-gray-700 line-clamp-2">
                    {course.courseName}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  {course.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {course.description}
                    </p>
                  )}

                  {/* Course Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Year Level:</span>
                      <span className="text-gray-800">{course.yearLevel}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">Semester:</span>
                      <span className="text-gray-800">{course.semester}</span>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-medium">Departments:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {course.departments?.map((dept, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedules */}
                  {course.schedules && course.schedules.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Schedule:
                      </p>
                      <div className="space-y-3">
                        {course.schedules.map((schedule, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-semibold text-gray-800">
                                {schedule.day}
                              </span>
                            </div>
                            <div className="space-y-1.5 ml-6">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                <span>
                                  {schedule.timeStart} - {schedule.timeEnd}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                <span>Room {schedule.room}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Users className="h-3.5 w-3.5 text-gray-400" />
                                <span>{schedule.instructor}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourses;
