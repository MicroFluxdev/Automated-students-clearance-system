import { useState, useEffect } from "react";
import { message } from "antd";
import { format } from "date-fns";
import {
  PlayCircle,
  PauseCircle,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  Settings,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";

interface ClearanceStatus {
  isActive: boolean;
  startDate: Date | null;
  deadline: Date | null;
  extendedDeadline: Date | null;
  semester?: string;
  academicYear?: string;
  semesterType?: string;
}

// Dummy Data for Clearance
const dummyClearanceData: ClearanceStatus[] = [
  {
    isActive: false,
    startDate: null,
    deadline: null,
    extendedDeadline: null,
    semester: "1st Semester",
    academicYear: "2024-2025",
    semesterType: "1st Semester",
  },
  {
    isActive: true,
    startDate: new Date("2024-08-15"),
    deadline: new Date("2024-12-15"),
    extendedDeadline: null,
    semester: "1st Sem 2024-2025",
    academicYear: "2024-2025",
    semesterType: "1st Semester",
  },
  {
    isActive: true,
    startDate: new Date("2025-01-15"),
    deadline: new Date("2025-05-15"),
    extendedDeadline: new Date("2025-06-15"),
    semester: "2nd Sem 2024-2025",
    academicYear: "2024-2025",
    semesterType: "2nd Semester",
  },
];

export const ClearanceStart = () => {
  // Dummy data state - using first entry as default
  const [dummyDataIndex] = useState(0);
  const [status, setStatus] = useState<ClearanceStatus>(
    dummyClearanceData[dummyDataIndex]
  );
  const [loading, setLoading] = useState(false);
  const [extendLoading, setExtendLoading] = useState(false);
  const [newDeadline, setNewDeadline] = useState<Date | undefined>(undefined);
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false);
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  // Form state for setup
  const [semesterType, setSemesterType] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);

  // Fetch current clearance status (using dummy data)
  const fetchClearanceStatus = async () => {
    try {
      setLoading(true);
      // Using dummy data - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const dummyStatus = dummyClearanceData[dummyDataIndex];
      setStatus(dummyStatus);
    } catch (error) {
      console.error("Error fetching clearance status:", error);
      // Use default dummy data
      setStatus(dummyClearanceData[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClearanceStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetupClearance = async () => {
    if (!semesterType || !academicYear || !deadlineDate) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      setSetupLoading(true);
      // Simulate API call with dummy data
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newStatus: ClearanceStatus = {
        isActive: false,
        startDate: null,
        deadline: deadlineDate,
        extendedDeadline: null,
        semester: `${semesterType} ${academicYear}`,
        academicYear: academicYear,
        semesterType: semesterType,
      };

      setStatus(newStatus);
      message.success(
        "Clearance setup completed! You can now start clearance."
      );
      setIsSetupDialogOpen(false);
      // Reset form
      setSemesterType("");
      setAcademicYear("");
      setDeadlineDate(undefined);
    } catch (error) {
      console.error("Error setting up clearance:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      message.error(
        axiosError?.response?.data?.message || "Failed to setup clearance"
      );
    } finally {
      setSetupLoading(false);
    }
  };

  const handleStartClearance = async () => {
    if (!status.deadline) {
      message.warning(
        "Please setup clearance first (semester, year, and deadline)"
      );
      setIsSetupDialogOpen(true);
      return;
    }

    try {
      setLoading(true);
      // Using dummy data - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus((prev) => ({
        ...prev,
        isActive: true,
        startDate: new Date(),
      }));
      message.success("Clearance started successfully!");
    } catch (error) {
      console.error("Error starting clearance:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      message.error(
        axiosError?.response?.data?.message || "Failed to start clearance"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStopClearance = async () => {
    try {
      setLoading(true);
      // Using dummy data - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus((prev) => ({
        ...prev,
        isActive: false,
      }));
      message.success("Clearance stopped successfully!");
    } catch (error) {
      console.error("Error stopping clearance:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      message.error(
        axiosError?.response?.data?.message || "Failed to stop clearance"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExtendDeadline = async () => {
    if (!newDeadline) {
      message.error("Please select a new deadline date");
      return;
    }

    const currentDeadline = status.extendedDeadline || status.deadline;
    if (currentDeadline && newDeadline <= currentDeadline) {
      message.error("New deadline must be after the current deadline");
      return;
    }

    try {
      setExtendLoading(true);
      // Using dummy data - simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus((prev) => ({
        ...prev,
        extendedDeadline: newDeadline,
      }));
      message.success(`Deadline extended to ${format(newDeadline, "PPP")}`);
      setIsExtendDialogOpen(false);
      setNewDeadline(undefined);
    } catch (error) {
      console.error("Error extending deadline:", error);
      const axiosError = error as AxiosError<{ message?: string }>;
      message.error(
        axiosError?.response?.data?.message || "Failed to extend deadline"
      );
    } finally {
      setExtendLoading(false);
    }
  };

  const currentDeadline = status.extendedDeadline || status.deadline;
  const daysRemaining = currentDeadline
    ? Math.ceil(
        (currentDeadline.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Set Clearance
          </h1>
          <p className="text-gray-500 mt-1">
            Start, stop, and manage clearance deadlines
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Control Card */}
        <Card className="lg:col-span-2 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Clearance Status</CardTitle>
                <CardDescription className="mt-1">
                  Control the clearance system activation
                </CardDescription>
              </div>
              <Badge
                variant={status.isActive ? "default" : "secondary"}
                className={cn(
                  "text-sm px-4 py-1.5",
                  status.isActive
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                )}
              >
                {status.isActive ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4" />
                    Inactive
                  </span>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Start Date</span>
                </div>
                <p className="text-lg font-semibold text-blue-900">
                  {status.startDate
                    ? format(status.startDate, "PPP")
                    : "Not started"}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">Current Deadline</span>
                </div>
                <p className="text-lg font-semibold text-purple-900">
                  {currentDeadline ? format(currentDeadline, "PPP") : "Not set"}
                </p>
                {status.extendedDeadline && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Extended
                  </Badge>
                )}
              </div>
            </div>

            {/* Semester & Year Info */}
            {(status.semester || status.academicYear) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <GraduationCap className="h-5 w-5" />
                    <span className="text-sm font-medium">Semester</span>
                  </div>
                  <p className="text-lg font-semibold text-green-900">
                    {status.semester || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-700 mb-2">
                    <CalendarDays className="h-5 w-5" />
                    <span className="text-sm font-medium">Academic Year</span>
                  </div>
                  <p className="text-lg font-semibold text-orange-900">
                    {status.academicYear || "Not set"}
                  </p>
                </div>
              </div>
            )}

            {/* Days Remaining Alert */}
            {currentDeadline && daysRemaining !== null && (
              <div
                className={cn(
                  "p-4 rounded-lg border flex items-center gap-3",
                  daysRemaining <= 7
                    ? "bg-red-50 border-red-200"
                    : daysRemaining <= 30
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-green-50 border-green-200"
                )}
              >
                {daysRemaining <= 7 ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {daysRemaining > 0
                      ? `${daysRemaining} day${
                          daysRemaining !== 1 ? "s" : ""
                        } remaining`
                      : "Deadline has passed"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {daysRemaining <= 7
                      ? "Consider extending the deadline"
                      : "Deadline is approaching"}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Dialog
                open={isSetupDialogOpen}
                onOpenChange={setIsSetupDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Setup Clearance
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Setup Clearance</DialogTitle>
                    <DialogDescription>
                      Configure semester, academic year, and deadline before
                      starting clearance.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester-type">Semester Type</Label>
                      <Select
                        value={semesterType}
                        onValueChange={setSemesterType}
                      >
                        <SelectTrigger id="semester-type" className="w-full">
                          <SelectValue placeholder="Select semester type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Semester">
                            1st Semester
                          </SelectItem>
                          <SelectItem value="2nd Semester">
                            2nd Semester
                          </SelectItem>
                          <SelectItem value="Summer">Summer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="academic-year">Academic Year</Label>
                      <Input
                        id="academic-year"
                        placeholder="e.g., 2024-2025"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Format: YYYY-YYYY (e.g., 2024-2025)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Clearance Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="deadline"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !deadlineDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {deadlineDate ? (
                              format(deadlineDate, "PPP")
                            ) : (
                              <span>Pick a deadline date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={deadlineDate}
                            onSelect={setDeadlineDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSetupDialogOpen(false);
                        setSemesterType("");
                        setAcademicYear("");
                        setDeadlineDate(undefined);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSetupClearance}
                      disabled={
                        setupLoading ||
                        !semesterType ||
                        !academicYear ||
                        !deadlineDate
                      }
                    >
                      {setupLoading ? "Setting up..." : "Setup Clearance"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {status.isActive ? (
                <Button
                  onClick={handleStopClearance}
                  disabled={loading}
                  variant="destructive"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  <PauseCircle className="h-5 w-5 mr-2" />
                  {loading ? "Stopping..." : "Stop Clearance"}
                </Button>
              ) : (
                <Button
                  onClick={handleStartClearance}
                  disabled={loading || !status.deadline}
                  size="lg"
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  {loading ? "Starting..." : "Start Clearance"}
                </Button>
              )}

              <Dialog
                open={isExtendDialogOpen}
                onOpenChange={setIsExtendDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none"
                    disabled={!status.isActive || !currentDeadline}
                  >
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Extend Deadline
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Extend Clearance Deadline</DialogTitle>
                    <DialogDescription>
                      Select a new deadline date. The new deadline must be after
                      the current deadline.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {currentDeadline && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium">
                          Current Deadline:
                        </p>
                        <p className="text-blue-900 font-semibold">
                          {format(currentDeadline, "PPP")}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="new-deadline">New Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="new-deadline"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newDeadline && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {newDeadline ? (
                              format(newDeadline, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={newDeadline}
                            onSelect={setNewDeadline}
                            disabled={(date) => {
                              if (!currentDeadline) return false;
                              return date <= currentDeadline;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsExtendDialogOpen(false);
                        setNewDeadline(undefined);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleExtendDeadline}
                      disabled={extendLoading || !newDeadline}
                    >
                      {extendLoading ? "Extending..." : "Extend Deadline"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Quick Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-1">
                  Setup Clearance
                </p>
                <p className="text-xs text-blue-600">
                  First step: Configure semester type, academic year, and
                  deadline. This must be done before starting clearance.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Starting Clearance
                </p>
                <p className="text-xs text-gray-600">
                  Activates the clearance system for all students. Students can
                  begin submitting their clearance documents.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Stopping Clearance
                </p>
                <p className="text-xs text-gray-600">
                  Deactivates the clearance system. Students will no longer be
                  able to submit new documents.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Extending Deadline
                </p>
                <p className="text-xs text-gray-600">
                  Allows you to extend the clearance deadline beyond the
                  original date. Useful when students need more time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
