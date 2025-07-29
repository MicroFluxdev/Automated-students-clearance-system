import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Table,
  Modal,
  DatePicker,
  Checkbox,
  Space,
} from "antd";
import {
  PlusOutlined,
  FileTextOutlined,
  DeleteOutlined,
  BankOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";

interface Requirement {
  id: number;
  name: string;
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

const Requirements = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequirement, setNewRequirement] = useState<Partial<Requirement>>({
    name: "",
    description: "",
    isOptional: false,
    department: "",
  });

  const handleAddRequirement = () => {
    if (
      newRequirement.name &&
      newRequirement.deadline &&
      newRequirement.department
    ) {
      setRequirements([
        ...requirements,
        {
          id: Date.now(),
          name: newRequirement.name,
          description: newRequirement.description || "",
          deadline: newRequirement.deadline,
          isOptional: newRequirement.isOptional || false,
          department: newRequirement.department,
        },
      ]);
      setNewRequirement({
        name: "",
        description: "",
        isOptional: false,
        department: "",
      });
      setIsModalOpen(false);
    }
  };

  const handleDeleteRequirement = (id: number) => {
    setRequirements(requirements.filter((req) => req.id !== id));
  };

  const columns = [
    {
      title: "Requirement",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department: string) => (
        <Space>
          <BankOutlined className="text-blue-500" />
          {department}
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => description || "No description",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (deadline: Date) => (
        <Space>
          <CalendarOutlined />
          {format(deadline, "MMM dd, yyyy")}
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "isOptional",
      key: "isOptional",
      render: (isOptional: boolean) => (
        <span className={isOptional ? "text-blue-500" : "text-red-500"}>
          {isOptional ? "Optional" : "Mandatory"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Requirement) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRequirement(record.id)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-500">
            Clearance Requirements
          </h1>
          <p className="text-gray-500">
            Manage department clearance requirements
          </p>
        </div>
        <Button type="primary" icon={<FileTextOutlined />}>
          Export Requirements
        </Button>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        className="mb-6"
      >
        Add New Requirement
      </Button>

      <Modal
        title="Add New Requirement"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddRequirement}
        okText="Add Requirement"
      >
        <Space direction="vertical" className="w-full">
          <div>
            <label className="block mb-2">Requirement Name</label>
            <Input
              value={newRequirement.name}
              onChange={(e) =>
                setNewRequirement({
                  ...newRequirement,
                  name: e.target.value,
                })
              }
              placeholder="Enter requirement name"
            />
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
            >
              {departments.map((dept) => (
                <Select.Option key={dept} value={dept}>
                  <Space>
                    <BankOutlined className="text-blue-500" />
                    {dept}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <Input
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
          <div>
            <Checkbox
              checked={newRequirement.isOptional}
              onChange={(e) =>
                setNewRequirement({
                  ...newRequirement,
                  isOptional: e.target.checked,
                })
              }
            >
              Optional Requirement
            </Checkbox>
          </div>
        </Space>
      </Modal>

      <Card>
        <Table columns={columns} dataSource={requirements} rowKey="id" />
      </Card>
    </div>
  );
};

export default Requirements;
