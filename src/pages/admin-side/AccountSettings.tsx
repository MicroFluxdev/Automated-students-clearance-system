import { useState } from "react";
import { Button, message } from "antd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminSettings() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [extendDeadline, setExtendDeadline] = useState(false);
  const [previousEndDate, setPreviousEndDate] = useState("");

  const handleSaveDeadline = () => {
    if (!startDate || !endDate) {
      message.error("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      message.error("Start date cannot be after end date.");
      return;
    }

    if (extendDeadline) {
      const prevEnd = new Date(previousEndDate);
      if (end <= prevEnd) {
        message.error(
          "New end date must be after current end date when extending."
        );
        return;
      }
    }

    setPreviousEndDate(endDate);
    message.success(
      `Clearance deadline ${
        extendDeadline ? "extended" : "set"
      } from ${startDate} to ${endDate}`
    );
  };

  const handleChangePassword = () => {
    if (password === confirmPassword) {
      message.success("Password changed successfully!");
    } else {
      message.error("Passwords do not match!");
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
              Account Settings
            </h1>
            <p className="text-gray-500">Manage your account settings</p>
          </div>
        </div>
      </div>
      <div className="p-6 max-w-4xl">
        <Tabs defaultValue="clearance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-blue-500">
            <TabsTrigger value="clearance">Clearance Deadline</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="clearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Set Clearance Period</CardTitle>
                <CardDescription>
                  Configure the clearance deadline for students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {previousEndDate && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Previous deadline ended on:{" "}
                      <strong>{previousEndDate}</strong>
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extend"
                    checked={extendDeadline}
                    onCheckedChange={(checked) => {
                      const newValue = checked as boolean;
                      setExtendDeadline(newValue);
                      if (newValue && previousEndDate) {
                        setStartDate(previousEndDate);
                      } else {
                        setStartDate("");
                      }
                    }}
                  />
                  <Label htmlFor="extend" className="text-sm font-medium">
                    Extend from current deadline
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={extendDeadline}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  type="primary"
                  onClick={handleSaveDeadline}
                  className="w-full md:w-auto"
                >
                  Save Deadline
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Admin Password</CardTitle>
                <CardDescription>
                  Update your administrator account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  type="primary"
                  onClick={handleChangePassword}
                  className="w-full md:w-auto"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
