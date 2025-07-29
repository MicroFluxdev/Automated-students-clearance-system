import { useState } from "react";
import { Card, Button, Input, Table, Modal, Select, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { UserCog } from "lucide-react";

interface ClearingOfficer {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
}

const departments = [
  "Computer Science",
  "Information Technology",
  "Computer Engineering",
  "Information Systems",
  "Software Engineering",
];

const AddClearingOfficer = () => {
  const [officers, setOfficers] = useState<ClearingOfficer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState<Partial<ClearingOfficer>>({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const handleAddOfficer = () => {
    if (newOfficer.name && newOfficer.email && newOfficer.department) {
      setOfficers([
        ...officers,
        {
          id: Date.now(),
          name: newOfficer.name,
          email: newOfficer.email,
          phone: newOfficer.phone || "",
          department: newOfficer.department,
        },
      ]);
      setNewOfficer({
        name: "",
        email: "",
        phone: "",
        department: "",
      });
      setIsModalOpen(false);
    }
  };

  const handleDeleteOfficer = (id: number) => {
    setOfficers(officers.filter((officer) => officer.id !== id));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Space>
          <UserOutlined className="text-blue-500" />
          {name}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <Space>
          <MailOutlined className="text-green-500" />
          {email}
        </Space>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <Space>
          <PhoneOutlined className="text-purple-500" />
          {phone || "Not provided"}
        </Space>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ClearingOfficer) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteOfficer(record.id)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-500 flex items-center gap-2">
            <UserCog size={24} />
            Clearing Officers Management
          </h1>
          <p className="text-gray-500">Manage clearing officers</p>
        </div>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        className="mb-6"
      >
        Add New Officer
      </Button>

      <Modal
        title="Add New Clearing Officer"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddOfficer}
        okText="Add Officer"
      >
        <Space direction="vertical" className="w-full">
          <div>
            <label className="block mb-2">Name</label>
            <Input
              value={newOfficer.name}
              onChange={(e) =>
                setNewOfficer({
                  ...newOfficer,
                  name: e.target.value,
                })
              }
              placeholder="Enter officer name"
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <Input
              value={newOfficer.email}
              onChange={(e) =>
                setNewOfficer({
                  ...newOfficer,
                  email: e.target.value,
                })
              }
              placeholder="Enter officer email"
            />
          </div>
          <div>
            <label className="block mb-2">Phone</label>
            <Input
              value={newOfficer.phone}
              onChange={(e) =>
                setNewOfficer({
                  ...newOfficer,
                  phone: e.target.value,
                })
              }
              placeholder="Enter officer phone"
            />
          </div>
          <div>
            <label className="block mb-2">Department</label>
            <Select
              className="w-full"
              value={newOfficer.department}
              onChange={(value) =>
                setNewOfficer({ ...newOfficer, department: value })
              }
              placeholder="Select department"
            >
              {departments.map((dept) => (
                <Select.Option key={dept} value={dept}>
                  {dept}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Space>
      </Modal>

      <Card>
        <Table columns={columns} dataSource={officers} rowKey="id" />
      </Card>
    </div>
  );
};

export default AddClearingOfficer;
