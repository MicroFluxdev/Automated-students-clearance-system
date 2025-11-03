import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Modal,
  DatePicker,
  Space,
  Tag,
  Descriptions,
  message,
  Popover,
  Dropdown,
  Typography,
  Menu,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  BankOutlined,
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  TeamOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import {
  createInstitutionalRequirement,
  getAllInstitutionalRequirements,
  updateInstitutionalRequirement,
  deleteInstitutionalRequirement,
} from "@/services/institutionalRequirementsService";

interface Requirement {
  _id?: string;
  id?: string;
  institutionalName: string;
  requirements: string[];
  description: string;
  deadline: Date | string;
  department: string;
  semester: string;
}

const departments = [
  "Computer Science",
  "Information Technology",
  "Computer Engineering",
  "Information Systems",
  "Software Engineering",
];

const semesters = ["1st Semester", "2nd Semester"];

const { Text } = Typography;

// Utility: truncate with ellipsis
const ellipsize = (text: string, limit = 120) =>
  text && text.length > limit ? `${text.slice(0, limit)}…` : text;

const Requirements = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Add form state
  const [nameTags, setNameTags] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState<{
    courseCode: string;
    description: string;
    isOptional: boolean;
    department: string;
    semester: string;
    deadline?: Date;
  }>({
    courseCode: "",
    description: "",
    isOptional: false,
    department: "",
    semester: "",
  });

  // View/Edit modals state
  const [viewItem, setViewItem] = useState<Requirement | null>(null);
  const [editItem, setEditItem] = useState<Requirement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    courseCode: string;
    department: string;
    semester: string;
    names: string[];
    description: string;
    deadline?: Date;
  }>({
    courseCode: "",
    department: "",
    semester: "",
    names: [],
    description: "",
    deadline: undefined,
  });

  const normalizedNames = nameTags
    .map((n) => (n || "").trim())
    .filter((n) => n.length > 0);

  // Fetch requirements on component mount
  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await getAllInstitutionalRequirements();
      console.log("Full response:", response);

      // Handle different response structures
      let requirementsData = [];

      if (Array.isArray(response)) {
        requirementsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        requirementsData = response.data;
      } else if (
        response.requirements &&
        Array.isArray(response.requirements)
      ) {
        requirementsData = response.requirements;
      }

      console.log("Requirements data:", requirementsData);

      // Map API response to local state format
      const mappedRequirements = requirementsData.map(
        (req: Record<string, unknown>) => ({
          id: req.id as string,
          institutionalName: req.institutionalName as string,
          requirements: req.requirements as string[],
          description: req.description as string,
          deadline: req.deadline as string,
          department: req.department as string,
          semester: req.semester as string,
        })
      );

      console.log("Mapped requirements:", mappedRequirements);
      setRequirements(mappedRequirements);
    } catch (error) {
      console.error("Error fetching requirements:", error);
      message.error("Failed to load requirements.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequirement = async () => {
    const hasRequiredFields =
      newRequirement.deadline &&
      newRequirement.department &&
      newRequirement.semester &&
      normalizedNames.length > 0 &&
      newRequirement.courseCode.trim().length > 0;

    if (!hasRequiredFields) {
      message.warning("Please complete all required fields.");
      return;
    }

    setAddLoading(true);
    try {
      // Call API to create institutional requirement
      const payload = {
        institutionalName: newRequirement.courseCode.trim(),
        requirements: normalizedNames,
        department: newRequirement.department,
        description: newRequirement.description || "",
        semester: newRequirement.semester,
        deadline: newRequirement.deadline!.toISOString(),
      };

      await createInstitutionalRequirement(payload);

      message.success("Requirement created successfully!");

      // Refresh the requirements list
      await fetchRequirements();

      // reset
      setNameTags([]);
      setNewRequirement({
        courseCode: "",
        description: "",
        isOptional: false,
        department: "",
        semester: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating requirement:", error);
      message.error("Failed to create requirement. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteRequirement = (id: string, institutionalName: string) => {
    Modal.confirm({
      title: "Delete Requirement",
      content: `Are you sure you want to delete "${institutionalName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          console.log("Attempting to delete requirement with ID:", id);
          await deleteInstitutionalRequirement(id);
          message.success("Requirement deleted successfully!");

          // Refresh the requirements list
          await fetchRequirements();
        } catch (error: unknown) {
          console.error("Error deleting requirement:", error);
          const errorMessage =
            error && typeof error === "object" && "response" in error
              ? (error.response as { data?: { message?: string } })?.data
                  ?.message || "Failed to delete requirement. Please try again."
              : "Failed to delete requirement. Please try again.";
          message.error(errorMessage);
        }
      },
    });
  };

  const openViewModal = (record: Requirement) => {
    setViewItem(record);
  };

  const openEditModal = (record: Requirement) => {
    setEditItem(record);
    setEditForm({
      courseCode: record.institutionalName,
      department: record.department,
      semester: record.semester,
      names: [...record.requirements],
      description: record.description,
      deadline:
        typeof record.deadline === "string"
          ? new Date(record.deadline)
          : record.deadline,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (
      !editForm.courseCode.trim() ||
      !editForm.department ||
      !editForm.semester ||
      !editForm.deadline ||
      (editForm.names || []).filter((n) => n.trim()).length === 0
    ) {
      message.warning("Please complete all required fields in the edit form.");
      return;
    }

    if (!editItem?.id) {
      message.error("Invalid requirement ID.");
      return;
    }

    setUpdateLoading(true);
    try {
      const payload = {
        institutionalName: editForm.courseCode.trim(),
        requirements: editForm.names.map((n) => n.trim()).filter((n) => n),
        department: editForm.department,
        semester: editForm.semester,
        description: editForm.description,
        deadline:
          typeof editForm.deadline === "string"
            ? editForm.deadline
            : editForm.deadline.toISOString(),
      };

      console.log("Updating requirement with payload:", payload);
      await updateInstitutionalRequirement(editItem.id, payload);
      message.success("Requirement updated successfully!");

      // Refresh the requirements list
      await fetchRequirements();

      setIsEditModalOpen(false);
      setEditItem(null);
    } catch (error: unknown) {
      console.error("Error updating requirement:", error);
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error.response as { data?: { message?: string } })?.data
              ?.message || "Failed to update requirement. Please try again."
          : "Failed to update requirement. Please try again.";
      message.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const MAX_VISIBLE_TAGS = 3;
  const DESCRIPTION_LIMIT = 120;

  const columns = [
    {
      title: <span className="font-semibold">Institutional name</span>,
      dataIndex: "institutionalName",
      key: "institutionalName",
      render: (institutionalName: string) => (
        <span className="text-gray-600 dark:text-gray-400">
          {institutionalName || "No institutional name"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold">Requirements</span>,
      dataIndex: "requirements",
      key: "requirements",
      render: (requirements: string[]) => {
        const visible = requirements.slice(0, MAX_VISIBLE_TAGS);
        const hidden = requirements.slice(MAX_VISIBLE_TAGS);

        const dropdownMenu = {
          items: hidden.map((n, idx) => ({
            key: `${idx}`,
            label: (
              <div className="flex items-center">
                <Tag color="blue" className="mr-2">
                  {n}
                </Tag>
              </div>
            ),
          })),
        };

        return (
          <div className="flex flex-wrap items-center ">
            <div className="flex flex-wrap gap-2">
              {visible.map((name, i) => (
                <Tag
                  key={i}
                  color="blue"
                  className="text-sm font-medium px-2 py-1 rounded-lg"
                >
                  {name}
                </Tag>
              ))}
            </div>
            {hidden.length > 0 && (
              <Dropdown menu={dropdownMenu} trigger={["click"]}>
                <span className="cursor-pointer text-sm text-blue-500 py-1 rounded-lg">
                  +{hidden.length} more
                </span>
              </Dropdown>
            )}
          </div>
        );
      },
    },
    {
      title: <span className="font-semibold">Department</span>,
      dataIndex: "department",
      key: "department",
      render: (department: string) => (
        <div className="flex items-center">
          <BankOutlined className="text-blue-500 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">{department}</span>
        </div>
      ),
    },
    {
      title: <span className="font-semibold">Semester</span>,
      dataIndex: "semester",
      key: "semester",
      render: (semester: string) => (
        <Tag color="green" className="text-sm font-medium px-3 py-1">
          {semester}
        </Tag>
      ),
    },
    {
      title: <span className="font-semibold">Description</span>,
      dataIndex: "description",
      key: "description",
      width: 400,
      render: (description: string) => {
        if (!description) {
          return (
            <span className="text-gray-600 dark:text-gray-400">
              No description
            </span>
          );
        }
        const isLong = description.length > DESCRIPTION_LIMIT;
        const short = ellipsize(description, DESCRIPTION_LIMIT);

        return isLong ? (
          <div className="text-gray-600 dark:text-gray-300">
            <Text>{short} </Text>
            <Popover
              content={
                <div className="max-w-[420px] whitespace-pre-wrap break-words leading-relaxed text-gray-700">
                  {description || "No description available."}
                </div>
              }
              title="Full Description"
              trigger="click"
            >
              <Button
                type="link"
                size="small"
                style={{
                  padding: 0,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                See more
              </Button>
            </Popover>
          </div>
        ) : (
          <span className="text-gray-600 dark:text-gray-400">
            {description}
          </span>
        );
      },
    },
    {
      title: <span className="font-semibold">Deadline</span>,
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline: Date | string) => {
        const date =
          typeof deadline === "string" ? new Date(deadline) : deadline;
        return (
          <div className="flex items-center">
            <CalendarOutlined className="text-blue-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              {format(date, "MMM dd, yyyy")}
            </span>
          </div>
        );
      },
    },
    {
      title: <span className="font-semibold">Actions</span>,
      key: "actions",
      render: (_: unknown, record: Requirement) => {
        // Dropdown menu items for actions
        const actionMenu = (
          <Menu>
            <Menu.Item
              key="view-students"
              icon={<TeamOutlined />}
              onClick={() =>
                navigate(`/clearing-officer/sao/students/${record.id}`)
              }
            >
              View Students
            </Menu.Item>
            <Menu.Item
              key="view-details"
              icon={<EyeOutlined />}
              onClick={() => openViewModal(record)}
            >
              View Details
            </Menu.Item>
          </Menu>
        );
        return (
          <Space>
            <Dropdown overlay={actionMenu} trigger={["click"]}>
              <Button>
                Actions <DownOutlined />
              </Button>
            </Dropdown>
            <Button
              key="edit"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            >
              Edit
            </Button>
            <Button
              key="delete"
              icon={<DeleteOutlined />}
              danger
              onClick={() =>
                record.id &&
                handleDeleteRequirement(record.id, record.institutionalName)
              }
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Clearance Requirements
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage department clearance requirements
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Set Requirement
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        title="Set Requirement"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddRequirement}
        okText="Save Requirement"
        confirmLoading={addLoading}
      >
        <Space direction="vertical" className="w-full">
          <div>
            <label className="block mb-2">Institutional name</label>
            <Input
              value={newRequirement.courseCode}
              onChange={(e) =>
                setNewRequirement({
                  ...newRequirement,
                  courseCode: e.target.value,
                })
              }
              placeholder="Enter Institutional name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Requirement Names
            </label>
            <Select
              mode="tags"
              value={nameTags}
              onChange={(vals) =>
                setNameTags(
                  (vals as string[]).map((v) => v.trim()).filter((v) => v)
                )
              }
              tokenSeparators={[",", "\n", " "]}
              placeholder="Type a name and press Enter…"
              className="w-full"
              open={false}
            />
            <div className="mt-2 text-xs text-gray-500">
              Tip: Press Enter, space or type a comma to create a tag. Click the
              “x” to remove.
            </div>
          </div>

          <div>
            <label className="block mb-2">Department</label>
            <Select
              className="w-full"
              value={newRequirement.department}
              onChange={(value) =>
                setNewRequirement({ ...newRequirement, department: value })
              }
              placeholder="Select department"
              options={departments.map((d) => ({ label: d, value: d }))}
            />
          </div>

          <div>
            <label className="block mb-2">Semester</label>
            <Select
              className="w-full"
              value={newRequirement.semester}
              onChange={(value) =>
                setNewRequirement({ ...newRequirement, semester: value })
              }
              placeholder="Select semester"
              options={semesters.map((s) => ({ label: s, value: s }))}
            />
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <TextArea
              rows={4}
              value={newRequirement.description}
              onChange={(e) =>
                setNewRequirement({
                  ...newRequirement,
                  description: e.target.value,
                })
              }
              placeholder="Enter requirement description"
            />
          </div>

          <div>
            <label className="block mb-2">Deadline</label>
            <DatePicker
              className="w-full"
              onChange={(date) =>
                setNewRequirement({
                  ...newRequirement,
                  deadline: date?.toDate(),
                })
              }
            />
          </div>
        </Space>
      </Modal>

      {/* View Modal */}
      <Modal
        title="View Requirement"
        open={!!viewItem}
        onCancel={() => setViewItem(null)}
        footer={[
          <Button key="close" onClick={() => setViewItem(null)}>
            Close
          </Button>,
        ]}
      >
        {viewItem && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Institutional name">
              {viewItem.institutionalName}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {viewItem.department}
            </Descriptions.Item>
            <Descriptions.Item label="Semester">
              <Tag color="green">{viewItem.semester}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Requirements">
              <Space size={[4, 8]} wrap>
                {viewItem.requirements.map((n, i) => (
                  <Tag key={i} color="blue">
                    {n}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {viewItem.description || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Deadline">
              {format(
                typeof viewItem.deadline === "string"
                  ? new Date(viewItem.deadline)
                  : viewItem.deadline,
                "MMM dd, yyyy"
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Requirement"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditItem(null);
        }}
        onOk={handleSaveEdit}
        okText="Save Changes"
        confirmLoading={updateLoading}
      >
        <Space direction="vertical" className="w-full">
          <div>
            <label className="block mb-2">Institutional name</label>
            <Input
              value={editForm.courseCode}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, courseCode: e.target.value }))
              }
              placeholder="Enter Institutional name"
            />
          </div>

          <div>
            <label className="block mb-2">Requirement Names</label>
            <Select
              mode="tags"
              value={editForm.names}
              onChange={(vals) =>
                setEditForm((prev) => ({
                  ...prev,
                  names: (vals as string[])
                    .map((v) => v.trim())
                    .filter((v) => v),
                }))
              }
              tokenSeparators={[",", "\n", " "]}
              placeholder="Type a name and press Enter…"
              className="w-full"
              open={false}
            />
          </div>

          <div>
            <label className="block mb-2">Department</label>
            <Select
              className="w-full"
              value={editForm.department}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, department: value }))
              }
              placeholder="Select department"
              options={departments.map((d) => ({ label: d, value: d }))}
            />
          </div>

          <div>
            <label className="block mb-2">Semester</label>
            <Select
              className="w-full"
              value={editForm.semester}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, semester: value }))
              }
              placeholder="Select semester"
              options={semesters.map((s) => ({ label: s, value: s }))}
            />
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <TextArea
              rows={4}
              value={editForm.description}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter requirement description"
            />
          </div>

          <div>
            <label className="block mb-2">Deadline</label>
            <DatePicker
              className="w-full"
              value={editForm.deadline ? dayjs(editForm.deadline) : undefined}
              onChange={(date: Dayjs | null) =>
                setEditForm((prev) => ({
                  ...prev,
                  deadline: date ? date.toDate() : undefined,
                }))
              }
            />
          </div>
        </Space>
      </Modal>

      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <Table
          columns={columns}
          dataSource={requirements}
          rowKey="id"
          loading={loading}
          className="rounded-lg overflow-hidden"
          rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          scroll={{ x: "max-content" }}
          bordered
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Requirements;
