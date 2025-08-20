import { useState } from "react";
import { Card, Button, Input, Table, Modal, Select, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

interface Student {
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

const AddStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.department) {
      setStudents([
        ...students,
        {
          id: Date.now(),
          name: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone || "",
          department: newStudent.department,
        },
      ]);
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        department: "",
      });
      setIsModalOpen(false);
    }
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
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
      render: (_: any, record: Student) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteStudent(record.id)}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            Student Management
          </h1>
          <p className="text-gray-500">Add and manage students</p>
        </div>
      </div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalOpen(true)}
        className="mb-6"
      >
        Add New Student
      </Button>

      <Modal
        title="Add New Student"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddStudent}
        okText="Add Student"
      >
        <Space direction="vertical" className="w-full">
          <div>
            <label className="block mb-2">Student Name</label>
            <Input
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  name: e.target.value,
                })
              }
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <Input
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  email: e.target.value,
                })
              }
              placeholder="Enter student email"
            />
          </div>
          <div>
            <label className="block mb-2">Phone</label>
            <Input
              value={newStudent.phone}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  phone: e.target.value,
                })
              }
              placeholder="Enter student phone"
            />
          </div>
          <div>
            <label className="block mb-2">Department</label>
            <Select
              className="w-full"
              value={newStudent.department}
              onChange={(value) =>
                setNewStudent({ ...newStudent, department: value })
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
        <Table columns={columns} dataSource={students} rowKey="id" />
      </Card>
    </div>
  );
};

export default AddStudents;
