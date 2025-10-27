import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Save } from "lucide-react";
import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

export interface EditRequirementData {
  _id?: string;
  id?: string;
  courseCode: string;
  courseName: string;
  yearLevel: string;
  semester: string;
  department: string;
  requirements: string[];
  dueDate: string;
  description?: string;
}

interface EditRequirementModalProps {
  visible: boolean;
  requirement: EditRequirementData | null;
  onClose: () => void;
  onSave: (id: string, updatedData: Partial<EditRequirementData>) => void;
  loading?: boolean;
}

const EditRequirementModal: React.FC<EditRequirementModalProps> = ({
  visible,
  requirement,
  onClose,
  onSave,
  loading = false,
}) => {
  // Local state for editing
  const [editedRequirement, setEditedRequirement] =
    useState<EditRequirementData | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Ref to avoid stale closure issues
  const editedRequirementRef = useRef(editedRequirement);

  // Update ref when edited requirement changes
  useEffect(() => {
    editedRequirementRef.current = editedRequirement;
  }, [editedRequirement]);

  // Initialize edited requirement when modal opens
  useEffect(() => {
    if (visible && requirement) {
      setEditedRequirement({
        ...requirement,
        requirements: [...requirement.requirements],
      });
    } else if (!visible) {
      // Reset when modal closes
      setEditedRequirement(null);
      setInputValue("");
    }
  }, [visible, requirement]);

  // Handler for description change
  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setEditedRequirement((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          description: newValue,
        };
      });
    },
    []
  );

  // Handler for date change
  const handleDateChange = useCallback((date: Dayjs | null) => {
    setEditedRequirement((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        dueDate: date ? date.format("YYYY-MM-DD") : "",
      };
    });
  }, []);

  // Add requirement tag
  const addRequirement = useCallback((value: string) => {
    const trimmedValue = value.trim();
    const current = editedRequirementRef.current;
    if (
      trimmedValue &&
      current &&
      !current.requirements.includes(trimmedValue)
    ) {
      setEditedRequirement({
        ...current,
        requirements: [...current.requirements, trimmedValue],
      });
      setInputValue("");
    }
  }, []);

  // Remove requirement tag
  const removeRequirement = useCallback((index: number) => {
    const current = editedRequirementRef.current;
    if (current) {
      setEditedRequirement({
        ...current,
        requirements: current.requirements.filter(
          (_, i: number) => i !== index
        ),
      });
    }
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    if (inputValue.trim()) {
      addRequirement(inputValue);
    }
  }, [inputValue, addRequirement]);

  // Handle key press (Enter or comma)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const current = editedRequirementRef.current;
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addRequirement(inputValue);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        current &&
        current.requirements.length > 0
      ) {
        // Remove last tag on backspace when input is empty
        removeRequirement(current.requirements.length - 1);
      }
    },
    [inputValue, addRequirement, removeRequirement]
  );

  // Handle save
  const handleSave = useCallback(() => {
    if (!editedRequirement) return;

    const id = editedRequirement._id || editedRequirement.id;
    if (!id) {
      console.error("No ID found for requirement");
      return;
    }

    // Prepare updated data (only send changed fields)
    const updatedData: Partial<EditRequirementData> = {
      requirements: editedRequirement.requirements,
      dueDate: editedRequirement.dueDate,
      description: editedRequirement.description,
    };

    onSave(id, updatedData);
  }, [editedRequirement, onSave]);

  // Memoize placeholder text
  const inputPlaceholder = useMemo(() => {
    return editedRequirement?.requirements.length === 0
      ? "e.g., ID Card, Clearance Form, Library Card"
      : "Add another...";
  }, [editedRequirement?.requirements.length]);

  // Memoize requirement badges
  const requirementBadges = useMemo(() => {
    if (!editedRequirement) return null;
    return editedRequirement.requirements.map((req, index) => (
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
  }, [editedRequirement, removeRequirement]);

  if (!editedRequirement) return null;

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Requirement</DialogTitle>
          <DialogDescription>
            Update the clearance requirement details.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] px-4">
          <div className="grid gap-4 py-4">
            {/* Course Code (Read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-courseCode">Course Code</Label>
              <Input
                id="edit-courseCode"
                value={editedRequirement.courseCode}
                readOnly
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Course Name (Read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-courseName">Course Name</Label>
              <Input
                id="edit-courseName"
                value={editedRequirement.courseName}
                readOnly
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Year Level and Semester - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-yearLevel">Year Level</Label>
                <Input
                  id="edit-yearLevel"
                  value={editedRequirement.yearLevel}
                  readOnly
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-semester">Semester</Label>
                <Input
                  id="edit-semester"
                  value={editedRequirement.semester}
                  readOnly
                  disabled
                  className="bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Department (Read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={editedRequirement.department}
                readOnly
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Requirements - Tag Input (Editable) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-requirements">
                Requirements{" "}
                <span className="text-xs text-gray-500">
                  (Press Enter or comma to add)
                </span>
              </Label>
              <div className="min-h-[42px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-2">
                  {requirementBadges}
                  <Input
                    id="edit-requirements"
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

            {/* Due Date (Editable) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <DatePicker
                id="edit-dueDate"
                value={
                  editedRequirement.dueDate
                    ? dayjs(editedRequirement.dueDate)
                    : null
                }
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                placeholder="Select due date"
                className="w-full"
                size="large"
              />
            </div>

            {/* Description (Editable) */}
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter requirement description"
                value={editedRequirement.description || ""}
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
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequirementModal;
