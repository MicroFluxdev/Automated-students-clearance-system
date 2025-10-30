import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";

import ReqDialogForm from "./_components/ReqDialogForm";
import RequirementsTable from "./_components/RequirementsTable";
import type { RequirementData } from "./_components/RequirementsTable";
import EditRequirementModal from "./_components/EditRequirementModal";
import type { EditRequirementData } from "./_components/EditRequirementModal";
import {
  updateRequirement,
  deleteRequirement,
} from "@/services/requirementService";

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
  const [loading, setLoading] = useState(true);

  // State for Edit Modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRequirement, setEditingRequirement] =
    useState<EditRequirementData | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Fetch requirements from backend
  useEffect(() => {
    // Wait for auth initialization before making requests
    if (!isInitialized) {
      console.log("⏳ Waiting for auth initialization...");
      return;
    }

    // Create abort controller for cleanup
    const abortController = new AbortController();

    const fetchRequirements = async () => {
      // Set loading to true at the start of each fetch
      setLoading(true);

      // Early return if no user
      if (!user || !user.schoolId) {
        console.warn("⚠️ No user or schoolId found, skipping fetch");
        setLoading(false);
        return;
      }

      // Check if token exists before making request
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("❌ No access token found in localStorage");
        message.error("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      console.log("🔑 Token exists:", token.substring(0, 20) + "...");
      console.log("👤 User:", user);

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

        // Only show messages after data is loaded, not during skeleton display
        if (userRequirements.length > 0) {
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

        setRequirementsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, [user, isInitialized]);

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

        coursesData.forEach((course: Course) => {
          console.log(course.courseCode);
        });

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

  // Get unique departments from data
  const departments = Array.from(
    new Set(requirementsData.map((req) => req.department))
  );

  // Add "all" as the first category
  const categories = ["all", ...departments];

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

        console.log("✅ User's requirements after refresh:", userRequirements);

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

  // Handler to open edit modal
  const handleEditRequirement = (record: RequirementData) => {
    console.log("Opening edit modal for:", record);
    setEditingRequirement({
      _id: record._id,
      id: record.id,
      courseCode: record.courseCode,
      courseName: record.courseName,
      yearLevel: record.yearLevel,
      semester: record.semester,
      department: record.department,
      requirements: [...record.requirements],
      dueDate: record.dueDate,
      description: record.description,
    });
    setIsEditModalVisible(true);
  };

  // Handler to close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingRequirement(null);
    setIsEditLoading(false);
  };

  // Handler to save edited requirement
  const handleSaveEditedRequirement = async (
    id: string,
    updatedData: Partial<EditRequirementData>
  ) => {
    try {
      setIsEditLoading(true);

      // Validate required fields
      if (updatedData.requirements && updatedData.requirements.length === 0) {
        message.error("Please add at least one requirement");
        setIsEditLoading(false);
        return;
      }

      // Show loading message
      const hideLoading = message.loading("Updating requirement...", 0);

      // Convert dueDate to ISO DateTime format if present
      const dataToUpdate = {
        ...updatedData,
        dueDate: updatedData.dueDate
          ? new Date(updatedData.dueDate).toISOString()
          : undefined,
      };

      // Make API call to update requirement
      await updateRequirement(id, dataToUpdate);

      // Hide loading message
      hideLoading();

      // Show success message
      message.success("Requirement updated successfully!");

      // Close modal
      handleCloseEditModal();

      // Refresh the requirements list
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

        console.log("✅ User's requirements after update:", userRequirements);

        setRequirementsData(userRequirements);
        console.log("✅ Requirements list refreshed after update");
      } catch (error) {
        console.error("⚠️ Failed to refresh requirements list:", error);
      }
    } catch (error) {
      console.error("Error updating requirement:", error);

      // Extract detailed error message
      let errorMessage = "Failed to update requirement. Please try again.";

      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);

        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid data. Please check all fields.";
        } else if (error.response?.status === 404) {
          errorMessage = "Requirement not found.";
        }
      }

      message.error(errorMessage);
    } finally {
      setIsEditLoading(false);
    }
  };

  // Handler to delete requirement
  const handleDeleteRequirement = async (record: RequirementData) => {
    try {
      const id = record._id || record.id;
      if (!id) {
        message.error("Cannot delete: requirement ID not found");
        return;
      }

      // Show loading message
      const hideLoading = message.loading("Deleting requirement...", 0);

      // Make API call to delete requirement
      await deleteRequirement(id);

      // Hide loading message
      hideLoading();

      // Show success message
      message.success("Requirement deleted successfully!");

      // Update local state by filtering out the deleted requirement
      setRequirementsData((prevData) =>
        prevData.filter((req) => {
          const reqId = req._id || req.id;
          return reqId !== id;
        })
      );

      console.log("✅ Requirement deleted successfully");
    } catch (error) {
      console.error("Error deleting requirement:", error);

      // Extract detailed error message
      let errorMessage = "Failed to delete requirement. Please try again.";

      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);

        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 404) {
          errorMessage = "Requirement not found.";
        } else if (error.response?.status === 403) {
          errorMessage =
            "You don't have permission to delete this requirement.";
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
                Requirements
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

        <div className="mt-6">
          <RequirementsTable
            data={filteredRequirements as RequirementData[]}
            loading={showSkeleton}
            onEdit={handleEditRequirement}
            onDelete={handleDeleteRequirement}
            onView={(record) => {
              console.log("View requirement:", record);
            }}
          />
        </div>

        {/* Edit Requirement Modal */}
        <EditRequirementModal
          visible={isEditModalVisible}
          requirement={editingRequirement}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditedRequirement}
          loading={isEditLoading}
        />
      </div>
    </div>
  );
};

export default Clearance;
