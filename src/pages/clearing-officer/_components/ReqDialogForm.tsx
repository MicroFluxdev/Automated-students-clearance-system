import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import type { ClearanceStatus } from "@/services/clearanceService";

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

// Define the requirement type
type Requirement = {
  courseCode: string;
  courseName: string;
  yearLevel: string;
  semester: string;
  requirements: string[];
  department: string;
  dueDate: string;
  description: string;
};

interface ReqDialogFormProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  courses: Course[];
  newRequirement: Requirement;
  setNewRequirement: (requirement: Requirement) => void;
  handleCreateRequirement: () => void;
  clearanceStatus: ClearanceStatus | null;
  disabled?: boolean;
}

const ReqDialogForm = ({
  isDialogOpen,
  setIsDialogOpen,
  courses,
  newRequirement,
  setNewRequirement,
  handleCreateRequirement,
  disabled = false,
}: ReqDialogFormProps) => {
  const [inputValue, setInputValue] = useState("");

  // Use ref to always have the latest requirement value without causing re-renders
  const requirementRef = useRef(newRequirement);

  useEffect(() => {
    requirementRef.current = newRequirement;
  }, [newRequirement]);

  // Handler for course selection - Memoized, no dependency on newRequirement
  const handleCourseSelect = useCallback(
    (courseCode: string) => {
      const selectedCourse = courses.find((c) => c.courseCode === courseCode);
      if (selectedCourse) {
        setNewRequirement({
          ...requirementRef.current,
          courseCode: selectedCourse.courseCode,
          courseName: selectedCourse.courseName,
          yearLevel: selectedCourse.yearLevel,
          semester: selectedCourse.semester,
          department: selectedCourse.departments.join(", "),
          description: selectedCourse.description || "",
        });
      }
    },
    [courses, setNewRequirement]
  );

  // Clear course selection - Memoized, no dependency on newRequirement
  const clearCourseSelection = useCallback(() => {
    setNewRequirement({
      ...requirementRef.current,
      courseCode: "",
      courseName: "",
      yearLevel: "",
      semester: "",
      department: "",
      description: "",
    });
  }, [setNewRequirement]);

  // Add requirement tag - Memoized, no dependency on newRequirement
  const addRequirement = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();
      if (
        trimmedValue &&
        !requirementRef.current.requirements.includes(trimmedValue)
      ) {
        setNewRequirement({
          ...requirementRef.current,
          requirements: [...requirementRef.current.requirements, trimmedValue],
        });
        setInputValue("");
      }
    },
    [setNewRequirement]
  );

  // Remove requirement tag - Memoized, no dependency on newRequirement
  const removeRequirement = useCallback(
    (index: number) => {
      setNewRequirement({
        ...requirementRef.current,
        requirements: requirementRef.current.requirements.filter(
          (_, i: number) => i !== index
        ),
      });
    },
    [setNewRequirement]
  );

  // Handle input change - Memoized
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Handle description change - Memoized, NO dependency on newRequirement!
  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setNewRequirement({
        ...requirementRef.current,
        description: newValue,
      });
    },
    [setNewRequirement]
  );

  // Handle date change - Memoized, no dependency on newRequirement
  // const handleDateChange = useCallback((date: Dayjs | null) => {
  //   setNewRequirement({
  //     ...requirementRef.current,
  //     dueDate: date ? date.format("YYYY-MM-DD") : "",
  //   });
  // }, [setNewRequirement]);

  // Handle blur on input - Memoized
  const handleInputBlur = useCallback(() => {
    if (inputValue.trim()) {
      addRequirement(inputValue);
    }
  }, [inputValue, addRequirement]);

  // Handle key press (Enter or comma) - Memoized
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addRequirement(inputValue);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        newRequirement.requirements.length > 0
      ) {
        // Remove last tag on backspace when input is empty
        removeRequirement(newRequirement.requirements.length - 1);
      }
    },
    [
      inputValue,
      newRequirement.requirements.length,
      addRequirement,
      removeRequirement,
    ]
  );

  // Memoize placeholder text to avoid recalculation
  const inputPlaceholder = useMemo(() => {
    return newRequirement.requirements.length === 0
      ? "e.g., ID Card, Clearance Form, Library Card"
      : "Add another...";
  }, [newRequirement.requirements.length]);

  // Memoize requirement badges to prevent re-rendering
  const requirementBadges = useMemo(() => {
    return newRequirement.requirements.map((req, index) => (
      <Badge
        key={`${req}-${index}`}
        variant="secondary"
        className="flex items-center gap-1 px-2 py-1"
      >
        <span>{req}</span>
        <button
          type="button"
          onClick={() => removeRequirement(index)}
          className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    ));
  }, [newRequirement.requirements, removeRequirement]);

  // // Function to disable dates outside clearance period
  // const disabledDate = useCallback((current: Dayjs) => {
  //   if (!clearanceStatus || !clearanceStatus.isActive) {
  //     // Disable all dates if clearance is not active
  //     return true;
  //   }

  //   const startDate = dayjs(clearanceStatus.startDate);
  //   const effectiveDeadline = clearanceStatus.extendedDeadline || clearanceStatus.deadline;
  //   const endDate = dayjs(effectiveDeadline);

  //   // Disable dates before start date or after deadline
  //   return current.isBefore(startDate, 'day') || current.isAfter(endDate, 'day');
  // }, [clearanceStatus]);

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
            title={
              disabled
                ? "Clearance period is not active"
                : "Create new requirement"
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Requirements
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Requirement</DialogTitle>
            <DialogDescription>
              Add a new clearance requirement for students to complete.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] px-4">
            <div className="grid gap-4 py-4">
              {/* Course Selection */}
              <div className="grid gap-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <div className="flex gap-2 mx-1">
                  <Select
                    value={newRequirement.courseCode}
                    onValueChange={handleCourseSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.courseCode}>
                          {course.courseCode} - {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {newRequirement.courseCode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={clearCourseSelection}
                      className="shrink-0"
                      title="Clear selection"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Course Name (Read-only) */}
              <div className="grid gap-2 mx-1">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="Auto-filled from course selection"
                  value={newRequirement.courseName}
                  readOnly
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* Year Level and Semester - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="yearLevel">Year Level</Label>
                  <Input
                    id="yearLevel"
                    placeholder="Auto-filled from course selection"
                    value={newRequirement.yearLevel}
                    readOnly
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div className="grid gap-2 mx-1">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    placeholder="Auto-filled from course selection"
                    value={newRequirement.semester}
                    readOnly
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Department (Read-only) */}
              <div className="grid gap-2 mx-1">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Auto-filled from course selection"
                  value={newRequirement.department}
                  readOnly
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>

              {/* Requirements - Tag Input */}
              <div className="grid gap-2 mx-1">
                <Label htmlFor="requirements">
                  Requirements{" "}
                  <span className="text-xs text-gray-500">
                    (Press Enter or comma to add)
                  </span>
                </Label>
                <div className="min-h-[42px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <div className="flex flex-wrap gap-2">
                    {requirementBadges}
                    <Input
                      id="requirements"
                      type="text"
                      placeholder={inputPlaceholder}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onBlur={handleInputBlur}
                      className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[200px] h-6 px-0"
                    />
                  </div>
                </div>
              </div>

              {/* Due Date */}
              {/* <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <DatePicker
                  id="dueDate"
                  value={
                    newRequirement.dueDate
                      ? dayjs(newRequirement.dueDate)
                      : null
                  }
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  placeholder={
                    disabled || !clearanceStatus?.isActive
                      ? "Clearance period not active"
                      : "Select due date"
                  }
                  className="w-full"
                  size="large"
                  disabledDate={disabledDate}
                  disabled={disabled || !clearanceStatus?.isActive}
                />
                {clearanceStatus?.isActive && (
                  <p className="text-xs text-gray-500">
                    Date must be between{" "}
                    {dayjs(clearanceStatus.startDate).format("MMM D, YYYY")} and{" "}
                    {dayjs(
                      clearanceStatus.extendedDeadline || clearanceStatus.deadline
                    ).format("MMM D, YYYY")}
                  </p>
                )}
              </div> */}

              {/* Description */}
              <div className="grid gap-2 mx-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter requirement description"
                  value={newRequirement.description}
                  onChange={handleDescriptionChange}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="space-x-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleCreateRequirement}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              Create Requirement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReqDialogForm;
