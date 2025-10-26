import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, FolderOpen } from "lucide-react";

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
import axiosInstance from "@/api/axios";
import { useAuth } from "@/authentication/useAuth";
import { message } from "antd";
import SkeletonCardLoading from "./_components/SkeletonCardLoading";

// Interface for Course data (used in dialog form)
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

// Interface for Requirement data (created requirements)
interface Requirement {
  _id?: string;
  id?: string;
  userId?: string; // The clearing officer who created this requirement
  courseCode: string;
  courseName: string;
  yearLevel: string;
  semester: string;
  requirements: string[];
  department: string;
  dueDate: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Clearance = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isInitialized } = useAuth();
  const { search, selectedCategory, isDialogOpen, newRequirement } =
    useSelector((state: RootState) => state.clearance);

  const [courses, setCourses] = useState<Course[]>([]);
  const [requirementsData, setRequirementsData] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true); // Start with true
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Track first load

  // Fetch requirements from backend
  useEffect(() => {
    // Don't set loading to true here, it's already true initially

    // Wait for auth initialization before making requests
    if (!isInitialized) {
      console.log("⏳ Waiting for auth initialization...");
      // Don't set loading to false here, wait for initialization
      return;
    }

    // Create abort controller for cleanup
    const abortController = new AbortController();

    const fetchRequirements = async () => {
      // Early return if no user
      if (!user || !user.schoolId) {
        console.warn("⚠️ No user or schoolId found, skipping fetch");
        setLoading(false);
        setIsFirstLoad(false);
        return;
      }

      // Check if token exists before making request
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("❌ No access token found in localStorage");
        message.error("Authentication token not found. Please log in again.");
        setLoading(false);
        setIsFirstLoad(false);
        return;
      }

      console.log("🔑 Token exists:", token.substring(0, 20) + "...");
      console.log("👤 User:", user);

      // Only set loading true if it's not the first load
      if (!isFirstLoad) {
        setLoading(true);
      }

      try {
        console.log("📡 Fetching requirements from /req/getAllReq...");

        // Pass signal for cancellation
        const response = await axiosInstance.get("/req/getAllReq", {
          signal: abortController.signal,
        });

        // Check if component is still mounted
        if (abortController.signal.aborted) return;

        console.log("✅ Response received:", response.status);
        console.log("📦 Full response data:", response.data);

        // Backend returns array of requirements directly
        const requirementsData = Array.isArray(response.data)
          ? response.data
          : response.data?.requirements || response.data?.courses || [];

        console.log("📚 Requirements data:", requirementsData);

        // Filter requirements to only show those belonging to current user
        const userRequirements = requirementsData.filter(
          (req: Requirement) => req.userId === user.id
        );

        console.log("👤 User ID:", user.id);
        console.log("✅ User's requirements:", userRequirements);

        setRequirementsData(userRequirements);

        if (userRequirements.length === 0) {
          message.info("No requirements found for your account");
        } else {
          message.success(`Loaded ${userRequirements.length} requirement(s)`);
        }
      } catch (error) {
        // Ignore abort errors
        if (axios.isCancel(error)) {
          console.log("Request cancelled");
          return;
        }

        console.error("❌ Error fetching requirements:", error);

        if (axios.isAxiosError(error)) {
          console.error("🔴 Error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
          });

          if (error.response?.status === 401) {
            message.error(
              "Unauthorized. Your session may have expired. Please try logging in again."
            );
          } else {
            const errorMessage =
              error.response?.data?.message || "Failed to fetch requirements";
            message.error(errorMessage);
          }
        } else {
          message.error("An unexpected error occurred");
        }

        setRequirementsData([]); // Reset to empty array on error
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchRequirements();

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, [user, isInitialized, isFirstLoad]); // Added isFirstLoad to dependencies

  // Fetch courses for the dialog form (to create new requirements)
  useEffect(() => {
    // Wait for auth initialization
    if (!isInitialized) {
      return;
    }

    const fetchCourses = async () => {
      if (!user?.schoolId) {
        console.warn("⚠️ No user schoolId found, skipping courses fetch");
        return;
      }

      try {
        const schoolId = user?.schoolId;
        const encodedSchoolId = encodeURIComponent(schoolId);

        console.log("📡 Fetching courses for dialog form...");

        const response = await axiosInstance.get(
          `http://localhost:4000/intigration/getCoursesBySchoolId/${encodedSchoolId}`
        );

        const coursesData = response.data?.courses || [];
        console.log("✅ Fetched courses for dialog:", coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message || "Failed to fetch courses";
          message.error(errorMessage);
        }
        setCourses([]);
      }
    };

    fetchCourses();
  }, [user?.schoolId, isInitialized]);

  const categories = [
    "all",
    "BS-Computer Science",
    "BS-Education",
    "BS-Administration",
    "BS-Accounting",
  ];

  // Filter requirements based on search and category
  const filteredRequirements = requirementsData.filter((req) => {
    const matchesSearch =
      req.courseCode?.toLowerCase().includes(search.toLowerCase()) ||
      req.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      req.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || req.department === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreateRequirement = async () => {
    try {
      // Validate required fields
      if (!newRequirement.courseCode) {
        message.error("Please select a course");
        return;
      }
      if (!newRequirement.dueDate) {
        message.error("Please select a due date");
        return;
      }
      if (newRequirement.requirements.length === 0) {
        message.error("Please add at least one requirement");
        return;
      }

      // Show loading message
      const hideLoading = message.loading("Creating requirement...", 0);

      // Convert dueDate to ISO DateTime format (MongoDB expects DateTime)
      const dueDateISO = new Date(newRequirement.dueDate).toISOString();

      // Make API call to create requirement
      const response = await axiosInstance.post("/req/createReq", {
        courseCode: newRequirement.courseCode,
        courseName: newRequirement.courseName,
        yearLevel: newRequirement.yearLevel,
        semester: newRequirement.semester,
        requirements: newRequirement.requirements,
        department: newRequirement.department,
        dueDate: dueDateISO,
        description: newRequirement.description,
      });

      // Hide loading message
      hideLoading();

      // Show success message
      message.success("Requirement created successfully!");
      console.log("Created requirement:", response.data);

      // Close dialog
      dispatch(setIsDialogOpen(false));

      // Reset form
      dispatch(
        setNewRequirement({
          courseCode: "",
          courseName: "",
          yearLevel: "",
          semester: "",
          requirements: [],
          department: "",
          dueDate: "",
          description: "",
        })
      );

      // Refresh the requirements list by re-fetching
      try {
        const refreshResponse = await axiosInstance.get("/req/getAllReq");
        const refreshedData = Array.isArray(refreshResponse.data)
          ? refreshResponse.data
          : refreshResponse.data?.requirements ||
            refreshResponse.data?.courses ||
            [];

        // Filter to only show current user's requirements
        const userRequirements = refreshedData.filter(
          (req: Requirement) => req.userId === user?.id
        );

        setRequirementsData(userRequirements);
        console.log("✅ Requirements list refreshed");
      } catch (error) {
        console.error("⚠️ Failed to refresh requirements list:", error);
      }
    } catch (error) {
      console.error("Error creating requirement:", error);

      // Extract detailed error message
      let errorMessage = "Failed to create requirement. Please try again.";

      if (axios.isAxiosError(error)) {
        // Log full error response for debugging
        console.error("Error response:", error.response?.data);

        // Try to get the most specific error message
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid data. Please check all required fields.";
        }
      }

      message.error(errorMessage);
    }
  };

  // Show skeleton while loading OR while waiting for auth initialization
  const showSkeleton = loading || !isInitialized;

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
              courses={courses}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={(value) => dispatch(setIsDialogOpen(value))}
              newRequirement={newRequirement}
              setNewRequirement={(value) => dispatch(setNewRequirement(value))}
              handleCreateRequirement={handleCreateRequirement}
            />
          </div>
        </header>

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

        {showSkeleton ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCardLoading key={index} />
            ))}
          </div>
        ) : filteredRequirements.length === 0 ? (
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
            {filteredRequirements.map((requirement, index) => (
              <RequirementCard
                key={requirement._id || requirement.id || index}
                index={index}
                courseCode={requirement.courseCode}
                courseName={requirement.courseName}
                yearLevel={requirement.yearLevel}
                semester={requirement.semester}
                department={[requirement.department]}
                completed={false}
                description={requirement.description || ""}
                dueDate={requirement.dueDate}
                students={0}
                requirements={requirement.requirements}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clearance;
