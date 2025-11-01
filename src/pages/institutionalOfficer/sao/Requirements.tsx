import { useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  BankOutlined,
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";

interface Requirement {
  id: number;
  courseCode: string;
  names: string[];
  description: string;
  deadline: Date;
  isOptional: boolean;
  department: string;
}

const departments = [
  "Computer Science",
  "Information Technology",
  "Computer Engineering",
  "Information Systems",
  "Software Engineering",
];

const { Text } = Typography;

// Utility: truncate with ellipsis
const ellipsize = (text: string, limit = 120) =>
  text && text.length > limit ? `${text.slice(0, limit)}…` : text;

const Requirements = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Add form state
  const [nameTags, setNameTags] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState<{
    courseCode: string;
    description: string;
    isOptional: boolean;
    department: string;
    deadline?: Date;
  }>({
    courseCode: "",
    description: "",
    isOptional: false,
    department: "",
  });

  // View/Edit modals state
  const [viewItem, setViewItem] = useState<Requirement | null>(null);
  const [editItem, setEditItem] = useState<Requirement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    courseCode: string;
    department: string;
    names: string[];
    description: string;
    deadline?: Date;
  }>({
    courseCode: "",
    department: "",
    names: [],
    description: "",
    deadline: undefined,
  });

  const normalizedNames = nameTags
    .map((n) => (n || "").trim())
    .filter((n) => n.length > 0);

  const handleAddRequirement = () => {
    const hasRequiredFields =
      newRequirement.deadline &&
      newRequirement.department &&
      normalizedNames.length > 0 &&
      newRequirement.courseCode.trim().length > 0;

    if (!hasRequiredFields) {
      message.warning("Please complete all required fields.");
      return;
    }

    const newItem: Requirement = {
      id: Date.now() + Math.floor(Math.random() * 1_000),
      courseCode: newRequirement.courseCode.trim(),
      names: normalizedNames,
      description: newRequirement.description || "",
      deadline: newRequirement.deadline as Date,
      isOptional: newRequirement.isOptional || false,
      department: newRequirement.department,
    };

    setRequirements((prev) => [...prev, newItem]);

    // reset
    setNameTags([]);
    setNewRequirement({
      courseCode: "",
      description: "",
      isOptional: false,
      department: "",
    });
    setIsModalOpen(false);
  };

  const handleDeleteRequirement = (id: number) => {
    setRequirements((prev) => prev.filter((req) => req.id !== id));
  };

  const openViewModal = (record: Requirement) => {
    setViewItem(record);
  };

  const openEditModal = (record: Requirement) => {
    setEditItem(record);
    setEditForm({
      courseCode: record.courseCode,
      department: record.department,
      names: [...record.names],
      description: record.description,
      deadline: record.deadline,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (
      !editForm.courseCode.trim() ||
      !editForm.department ||
      !editForm.deadline ||
      (editForm.names || []).filter((n) => n.trim()).length === 0
    ) {
      message.warning("Please complete all required fields in the edit form.");
      return;
    }

    setRequirements((prev) =>
      prev.map((r) =>
        r.id === editItem?.id
          ? {
              ...r,
              courseCode: editForm.courseCode.trim(),
              department: editForm.department,
              names: editForm.names.map((n) => n.trim()).filter((n) => n),
              description: editForm.description,
              deadline: editForm.deadline as Date,
            }
          : r
      )
    );

    setIsEditModalOpen(false);
    setEditItem(null);
    message.success("Requirement updated.");
  };

  const MAX_VISIBLE_TAGS = 3;
  const DESCRIPTION_LIMIT = 120;

  const columns = [
    {
      title: <span className="font-semibold">Institutional name</span>,
      dataIndex: "courseCode",
      key: "courseCode",
      render: (courseCode: string) => (
        <span className="text-gray-600 dark:text-gray-400">
          {courseCode || "No courseCode"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold">Requirements</span>,
      dataIndex: "names",
      key: "names",
      render: (names: string[]) => {
        const visible = names.slice(0, MAX_VISIBLE_TAGS);
        const hidden = names.slice(MAX_VISIBLE_TAGS);

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
          <div className="flex flex-wrap items-center gap-6">
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
      render: (deadline: Date) => (
        <div className="flex items-center">
          <CalendarOutlined className="text-blue-500 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">
            {format(deadline, "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
    {
      title: <span className="font-semibold">Actions</span>,
      key: "actions",
      render: (_: unknown, record: Requirement) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRequirement(record.id)}
            className="hover:bg-red-50 dark:hover:bg-red-900/20"
          />
        </Space>
      ),
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
            Add New Requirement
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        title="Add New Requirement"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddRequirement}
        okText="Add Requirement"
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
              {viewItem.courseCode}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {viewItem.department}
            </Descriptions.Item>
            <Descriptions.Item label="Requirements">
              <Space size={[4, 8]} wrap>
                {viewItem.names.map((n, i) => (
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
              {format(viewItem.deadline, "MMM dd, yyyy")}
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
          className="rounded-lg overflow-hidden"
          rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          scroll={{ x: "max-content" }}
          bordered
        />
      </Card>
    </div>
  );
};

export default Requirements;
