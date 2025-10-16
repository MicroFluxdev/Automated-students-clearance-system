import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  Select,
  Space,
  Form,
  message,
  Tag,
  DatePicker,
  Input,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { type ColumnsType } from "antd/es/table";
import { enrollmentDummyData } from "@/data/enrollmentDummyData";
import type { Semester } from "@/types/enrollment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const SemesterManagement: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>(
    enrollmentDummyData.semesters
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [form] = Form.useForm();

  const semesterTypes = ["1st Semester", "2nd Semester", "Summer"];
  const statuses = ["Upcoming", "Active", "Completed", "Cancelled"];

  const handleAddSemester = () => {
    setEditingSemester(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditSemester = (semester: Semester) => {
    setEditingSemester(semester);
    form.setFieldsValue({
      ...semester,
      startDate: semester.startDate ? new Date(semester.startDate) : null,
      endDate: semester.endDate ? new Date(semester.endDate) : null,
      enrollmentStartDate: semester.enrollmentStartDate
        ? new Date(semester.enrollmentStartDate)
        : null,
      enrollmentEndDate: semester.enrollmentEndDate
        ? new Date(semester.enrollmentEndDate)
        : null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteSemester = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this semester?",
      content:
        "This action cannot be undone and may affect existing enrollments.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setSemesters(semesters.filter((semester) => semester.id !== id));
        message.success("Semester deleted successfully");
      },
    });
  };

  const handleStatusChange = (semesterId: string, newStatus: string) => {
    setSemesters(
      semesters.map((semester) =>
        semester.id === semesterId
          ? {
              ...semester,
              status: newStatus as
                | "Upcoming"
                | "Active"
                | "Completed"
                | "Cancelled",
              dateUpdated: new Date().toISOString(),
            }
          : semester
      )
    );
    message.success(`Semester status updated to ${newStatus}`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingSemester) {
        const updatedSemester: Semester = {
          ...editingSemester,
          ...values,
          startDate: values.startDate
            ? values.startDate.format("YYYY-MM-DD")
            : "",
          endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : "",
          enrollmentStartDate: values.enrollmentStartDate
            ? values.enrollmentStartDate.format("YYYY-MM-DD")
            : "",
          enrollmentEndDate: values.enrollmentEndDate
            ? values.enrollmentEndDate.format("YYYY-MM-DD")
            : "",
          dateUpdated: new Date().toISOString(),
        };

        setSemesters(
          semesters.map((semester) =>
            semester.id === editingSemester.id ? updatedSemester : semester
          )
        );
        message.success("Semester updated successfully");
      } else {
        const newSemester: Semester = {
          id: `semester-${Date.now()}`,
          ...values,
          startDate: values.startDate
            ? values.startDate.format("YYYY-MM-DD")
            : "",
          endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : "",
          enrollmentStartDate: values.enrollmentStartDate
            ? values.enrollmentStartDate.format("YYYY-MM-DD")
            : "",
          enrollmentEndDate: values.enrollmentEndDate
            ? values.enrollmentEndDate.format("YYYY-MM-DD")
            : "",
          status: "Upcoming",
          dateCreated: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
        };

        setSemesters([newSemester, ...semesters]);
        message.success("Semester created successfully");
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green";
      case "Upcoming":
        return "blue";
      case "Completed":
        return "gray";
      case "Cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <PlayCircleOutlined />;
      case "Upcoming":
        return <CalendarOutlined />;
      case "Completed":
        return <CheckCircleOutlined />;
      case "Cancelled":
        return <PauseCircleOutlined />;
      default:
        return <CalendarOutlined />;
    }
  };

  const columns: ColumnsType<Semester> = [
    {
      title: "Semester",
      key: "semester",
      render: (_, record) => (
        <Space>
          <CalendarOutlined className="text-blue-500" />
          <div>
            <div className="font-medium">{record.semesterName}</div>
            <div className="text-sm text-gray-500">{record.academicYear}</div>
          </div>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Type",
      dataIndex: "semesterType",
      key: "semesterType",
      render: (type: string) => <Tag color="blue">{type}</Tag>,
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <div className="text-sm">
          <div>Start: {new Date(record.startDate).toLocaleDateString()}</div>
          <div>End: {new Date(record.endDate).toLocaleDateString()}</div>
        </div>
      ),
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Enrollment Period",
      key: "enrollmentPeriod",
      render: (_, record) => (
        <div className="text-sm">
          <div>
            Start: {new Date(record.enrollmentStartDate).toLocaleDateString()}
          </div>
          <div>
            End: {new Date(record.enrollmentEndDate).toLocaleDateString()}
          </div>
        </div>
      ),
      responsive: ["lg", "xl"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      ),
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Select
            value={record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            size="small"
            style={{ width: 100 }}
          >
            {statuses.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() =>
              message.info(`Viewing details for ${record.semesterName}`)
            }
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditSemester(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSemester(record.id)}
            disabled={record.status === "Active"}
          />
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  // Statistics
  const activeSemester = semesters.find((s) => s.status === "Active");
  const upcomingSemesters = semesters.filter((s) => s.status === "Upcoming");
  const completedSemesters = semesters.filter((s) => s.status === "Completed");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-700 flex items-center gap-3">
            <CalendarOutlined className="text-purple-600" />
            Semester Management
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage academic semesters
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddSemester}
        >
          Create Semester
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {semesters.length}
            </div>
            <div className="text-sm text-gray-600">Total Semesters</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {activeSemester ? 1 : 0}
            </div>
            <div className="text-sm text-gray-600">Active Semester</div>
            {activeSemester && (
              <div className="text-xs text-gray-500 mt-1">
                {activeSemester.semesterName}
              </div>
            )}
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {upcomingSemesters.length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {completedSemesters.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </Card>
      </div>

      {/* Current Semester Info */}
      {activeSemester && (
        <Card
          className="mb-6"
          style={{ border: "2px solid #52c41a", marginBottom: "20px" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Current Active Semester
              </h3>
              <div className="space-y-1">
                <div>
                  <strong>{activeSemester.semesterName}</strong>
                </div>
                <div className="text-gray-600">
                  {activeSemester.semesterType} • {activeSemester.academicYear}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activeSemester.startDate).toLocaleDateString()} -{" "}
                  {new Date(activeSemester.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Tag
                color="green"
                icon={<PlayCircleOutlined />}
                className="text-lg px-3 py-1"
              >
                Active
              </Tag>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card className="mt-6">
        <Table
          columns={columns}
          dataSource={semesters}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} semesters`,
          }}
        />
      </Card>

      {/* Add/Edit Semester Modal */}
      <Modal
        title={editingSemester ? "Edit Semester" : "Create New Semester"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleModalOk}
        okText={editingSemester ? "Update Semester" : "Create Semester"}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="semesterName"
            label="Semester Name"
            rules={[{ required: true, message: "Please enter semester name" }]}
          >
            <Input placeholder="e.g., 1st Sem 2025–2026" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="academicYear"
              label="Academic Year"
              rules={[
                { required: true, message: "Please enter academic year" },
              ]}
            >
              <Input placeholder="e.g., 2025-2026" />
            </Form.Item>
            <Form.Item
              name="semesterType"
              label="Semester Type"
              rules={[
                { required: true, message: "Please select semester type" },
              ]}
            >
              <Select placeholder="Select semester type">
                {semesterTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="duration"
            label="Semester Duration"
            rules={[
              { required: true, message: "Please select semester duration" },
            ]}
          >
            <RangePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="enrollmentPeriod"
            label="Enrollment Period"
            rules={[
              { required: true, message: "Please select enrollment period" },
            ]}
          >
            <RangePicker className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SemesterManagement;
