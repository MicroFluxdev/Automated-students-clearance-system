import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, FolderOpen, BookOpen, Loader2 } from "lucide-react";

import ReqDialogForm from "./_components/ReqDialogForm";
import RequirementCard from "./_components/RequirementCard";

import { useSelector, useDispatch } from "react-redux";
import { type RootState, type AppDispatch } from "@/store";
import {
  setSearch,
  setSelectedCategory,
  setIsDialogOpen,
  // addRequirement,
  setNewRequirement,
} from "@/store/slices/clearingOfficer/clearanceSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/authentication/useAuth";
import { message } from "antd";

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

const Clearance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const {
    search,
    selectedCategory,
    isDialogOpen,
    newRequirement,
    requirements,
  } = useSelector((state: RootState) => state.clearance);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch courses by instructor
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.schoolId) {
        return;
      }

      setLoading(true);
      try {
        // Combine firstName and lastName, then encode for URL
        const schoolId = user?.schoolId;
        const encodedSchoolId = encodeURIComponent(schoolId);
        console.log(
          "Fetching courses for:",
          schoolId,
          "| Encoded:",
          encodedSchoolId
        );
        const response = await axios.get(
          `http://localhost:4000/intigration/getCoursesBySchoolId/${encodedSchoolId}`
        );

        // Backend returns { instructor: "...", courses: [...] }
        // Extract the courses array from the response
        const coursesData = response.data?.courses || [];
        console.log("Fetched courses:", coursesData);
        console.log("Full response:", response.data);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        message.error("Failed to fetch courses");
        setCourses([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.schoolId]);

  const categories = [
    "all",
    "BS-Computer Science",
    "BS-Education",
    "BS-Administration",
    "BS-Accounting",
  ];

  const filteredRequirements = requirements.filter(
    (req) =>
      (req.title.toLowerCase().includes(search.toLowerCase()) ||
        req.description.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "all" || req.department === selectedCategory)
  );

  const handleCreateRequirement = () => {
    // Handle form submission logic here
    console.log("Creating requirement:", newRequirement);
    dispatch(setIsDialogOpen(false));
    // Reset form
    dispatch(
      setNewRequirement({
        title: "",
        description: "",
        dueDate: "",
        department: "",
        requirements: [],
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-6  min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Clearance
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Manage and track all available requirements.
              </p>
            </div>
          </div>

          {/* Dialog Form - responsive width */}
          <div className="w-full sm:w-auto">
            <ReqDialogForm
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={(value) => dispatch(setIsDialogOpen(value))}
              newRequirement={newRequirement}
              setNewRequirement={(value) => dispatch(setNewRequirement(value))}
              handleCreateRequirement={handleCreateRequirement}
              categories={categories}
            />
          </div>
        </header>

        {/* My Courses Section */}
        <Card className="mb-6 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              My Courses
            </h2>
          </div>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">
            Courses assigned to{" "}
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : "you"}
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : !Array.isArray(courses) || courses.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No courses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.isArray(courses) && courses.map((course) => (
                <Card
                  key={course.id}
                  className="p-4 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {course.courseCode}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
                        {course.courseName}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {course.yearLevel}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex flex-col sm:flex-row items-center gap-4 px-5 shadow-gray-100">
          <div className="relative flex-1 w-full sm:w-auto ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="pl-10 w-full  md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={(value) => dispatch(setSelectedCategory(value))}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {filteredRequirements.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              No Requirements Found
            </h2>
            <p className="mt-2 text-gray-500">
              Adjust your search or filter to find what you are looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {filteredRequirements.map((req, index) => (
              <RequirementCard
                key={req.id} // ✅ unique key
                index={index}
                title={req.title}
                department={req.department}
                completed={req.completed}
                description={req.description}
                dueDate={req.dueDate}
                students={req.students}
                requirements={req.requirements}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clearance;
