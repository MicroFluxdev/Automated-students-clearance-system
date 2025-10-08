import { useState } from "react";
import { Card, Button, Input, Table, Modal, Select, Space, Grid } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { type ColumnsType } from "antd/es/table";

const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
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
      setNewStudent({ name: "", email: "", phone: "", department: "" });
      setIsModalOpen(false);
    }
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const columns: ColumnsType<Student> = [
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
      responsive: ["xs", "sm", "md", "lg", "xl"],
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
      responsive: ["sm", "md", "lg", "xl"], // hidden on mobile
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
      responsive: ["md", "lg", "xl"], // hidden on mobile
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      responsive: ["sm", "md", "lg", "xl"], // hidden on mobile
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Student) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteStudent(record.id)}
        />
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-2 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            Student Management
          </h1>
          <p className="text-gray-500">Add and manage students</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="self-start md:self-center"
        >
          Add New Student
        </Button>
      </div>

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
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <Input
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              placeholder="Enter student email"
            />
          </div>
          <div>
            <label className="block mb-2">Phone</label>
            <Input
              value={newStudent.phone}
              onChange={(e) =>
                setNewStudent({ ...newStudent, phone: e.target.value })
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

      <Card className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 5 }}
          expandable={
            !screens.sm
              ? {
                  expandRowByClick: true,
                  expandedRowRender: (record: Student) => (
                    <div className="space-y-1">
                      {/* Show all fields except name */}
                      <p>
                        <MailOutlined /> Email: {record.email}
                      </p>
                      <p>
                        <PhoneOutlined /> Phone:{" "}
                        {record.phone || "Not provided"}
                      </p>
                      <p>Department: {record.department}</p>
                    </div>
                  ),
                  rowExpandable: () => true,
                }
              : undefined
          }
        />
      </Card>
    </div>
  );
};

export default AddStudents;
