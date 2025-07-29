import { useState } from "react";
import { Tabs, Card, Input, Button, message } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";

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

  const items: TabsProps["items"] = [
    {
      key: "clearance",
      label: "Clearance Deadline",
      children: (
        <Card title="Set Clearance Period">
          {previousEndDate && (
            <div style={{ marginBottom: 16, color: "#666" }}>
              Previous deadline ended on: <strong>{previousEndDate}</strong>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={extendDeadline}
                onChange={() => {
                  const newValue = !extendDeadline;
                  setExtendDeadline(newValue);
                  if (newValue && previousEndDate) {
                    setStartDate(previousEndDate);
                  } else {
                    setStartDate("");
                  }
                }}
              />
              Extend from current deadline
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={extendDeadline}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button type="primary" onClick={handleSaveDeadline}>
            Save
          </Button>
        </Card>
      ),
    },
    {
      key: "password",
      label: "Change Password",
      children: (
        <Card title="Change Admin Password">
          <Input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Input.Password
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Input.Password
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" onClick={handleChangePassword}>
            Save
          </Button>
        </Card>
      ),
    },
  ];

  return (
    <>
      <div className="p-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
              <SettingOutlined size={24} />
              Account Settings
            </h1>
            <p className="text-gray-500">Manage your account settings</p>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: 24,
          width: "50%",
          backgroundColor: "white",
          borderRadius: 16,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ maxWidth: 768, padding: 24 }}>
          <Tabs defaultActiveKey="clearance" items={items} />
        </div>
      </div>
    </>
  );
}
