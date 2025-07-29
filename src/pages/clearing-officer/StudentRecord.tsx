import React, { useState } from "react";
import {
  Input,
  Button,
  Table,
  Card,
  Checkbox,
  Select,
  Space,
  Tag,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  MailOutlined,
  CheckCircleOutlined,
  UndoOutlined,
  PhoneOutlined,
  IdcardOutlined,
  LeftOutlined,
  ReadOutlined,
  FileTextOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

interface Student {
  id: number;
  id_no: string;
  name: string;
  email: string;
  cp_no: string;
  profilePic: string;
  status: "Signed" | "Incomplete" | "Missing";
}

const students: Student[] = [
  {
    id: 1,
    id_no: "24-0334",
    name: "John Doe",
    email: "johndoe@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
    status: "Signed",
  },
  {
    id: 2,
    id_no: "20-0842",
    name: "Jane Smith",
    email: "janesmith@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "Incomplete",
  },
  {
    id: 3,
    id_no: "24-0334",
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    status: "Signed",
  },
  {
    id: 4,
    id_no: "24-0334",
    name: "Bob Brown",
    email: "bobbrown@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "Missing",
  },
  {
    id: 5,
    id_no: "24-0334",
    name: "Jane Smith",
    email: "janesmith@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "Signed",
  },
  {
    id: 6,
    id_no: "24-0334",
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    status: "Signed",
  },
  {
    id: 7,
    id_no: "24-0334",
    name: "Bob Brown",
    email: "bobbrown@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "Incomplete",
  },
  {
    id: 8,
    id_no: "24-0334",
    name: "Jane Smith",
    email: "janesmith@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    status: "Missing",
  },
  {
    id: 9,
    id_no: "21-0882",
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
    status: "Signed",
  },
  {
    id: 10,
    id_no: "24-0334",
    name: "Bob Brown",
    email: "bobbrown@example.com",
    cp_no: "09123456789",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
    status: "Missing",
  },
];

const StudentRecord: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [studentList, setStudentList] = useState<Student[]>(students);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = ["all", "Signed", "Incomplete", "Missing"];

  const filteredStudents = studentList
    .filter(
      (student) =>
        (student.name.toLowerCase().includes(search.toLowerCase()) ||
          student.email.toLowerCase().includes(search.toLowerCase()) ||
          student.id_no.toLowerCase().includes(search.toLowerCase())) &&
        (selectedStatus === "all" || student.status === selectedStatus)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSelectAll = (): void => {
    setSelectAll(!selectAll);
    setSelectedStudents(
      selectAll ? [] : filteredStudents.map((student) => student.id)
    );
  };

  const handleSelectStudent = (studentId: number): void => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSignSelected = (): void => {
    setStudentList((prevList) =>
      prevList.map((student) =>
        selectedStudents.includes(student.id)
          ? { ...student, status: "Signed" }
          : student
      )
    );
    setSelectedStudents([]);
    setSelectAll(false);
  };

  const handleUndoSelected = (): void => {
    setStudentList((prevList) =>
      prevList.map((student) =>
        selectedStudents.includes(student.id)
          ? { ...student, status: "Incomplete" }
          : student
      )
    );
    setSelectedStudents([]);
    setSelectAll(false);
  };

  const handleSignToggle = (studentId: number): void => {
    setStudentList((prevList) =>
      prevList.map((student) =>
        student.id === studentId
          ? {
              ...student,
              status: student.status === "Signed" ? "Incomplete" : "Signed",
            }
          : student
      )
    );
  };

  const columns = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Checkbox checked={selectAll} onChange={handleSelectAll} />
          <span>Select All</span>
        </div>
      ),
      dataIndex: "select",
      key: "select",
      width: 50,
      render: (_: any, record: Student) => (
        <Checkbox
          checked={selectedStudents.includes(record.id)}
          onChange={() => handleSelectStudent(record.id)}
        />
      ),
    },
    {
      title: "ID Number",
      dataIndex: "id_no",
      key: "id_no",
      render: (text: string) => (
        <Space>
          <IdcardOutlined style={{ color: "#1890ff" }} />
          {text}
        </Space>
      ),
    },
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Student) => (
        <Space>
          <img
            src={record.profilePic}
            alt={text}
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => (
        <Space>
          <MailOutlined style={{ color: "#1890ff" }} />
          {text}
        </Space>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "cp_no",
      key: "cp_no",
      render: (text: string) => (
        <Space>
          <PhoneOutlined style={{ color: "#1890ff" }} />
          {text}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Signed"
            ? "green"
            : status === "Incomplete"
            ? "orange"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Student) => (
        <Space>
          <Button
            type={record.status === "Signed" ? "primary" : "primary"}
            danger={record.status === "Signed"}
            onClick={() => handleSignToggle(record.id)}
            icon={
              record.status === "Signed" ? (
                <UndoOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
          >
            {record.status === "Signed" ? "Undo" : "Sign"}
          </Button>
          <Link to="/clearance">
            <Button type="primary" style={{ backgroundColor: "#faad14" }}>
              View
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Row justify="space-between" align="middle">
          <Col xs={24} sm={12}>
            <Space>
              <FileTextOutlined style={{ fontSize: 24 }} />
              <h1 style={{ margin: 0 }}>Student Records</h1>
            </Space>
          </Col>
          <Col xs={24} sm={12} style={{ textAlign: "right", marginTop: 8 }}>
            <Space wrap>
              <ReadOutlined style={{ color: "#722ed1" }} />
              <span>Department of Computer Science</span>
            </Space>
          </Col>
        </Row>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={12}>
                <Space wrap>
                  <Link to="/clearing-officer/courses">
                    <Button
                      icon={<LeftOutlined />}
                      type="primary"
                      style={{
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                      }}
                    >
                      Back
                    </Button>
                  </Link>
                  {/* <Tag color="purple">Requirements</Tag>
                  <Tag color="success">Signed</Tag>
                  <Tag color="warning">Incomplete</Tag>
                  <Tag color="error">Missing</Tag> */}
                </Space>
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right", marginTop: 8 }}>
                <Space wrap>
                  <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    style={{ minWidth: 150 }}
                  >
                    {statuses.map((status) => (
                      <Select.Option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Select.Option>
                    ))}
                  </Select>
                  <FilterOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                </Space>
              </Col>
            </Row>

            <Row justify="space-between" align="middle">
              <Col xs={24} sm={12}>
                <Input
                  placeholder="Search students..."
                  prefix={<SearchOutlined />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", maxWidth: 400 }}
                />
              </Col>
              <Col xs={24} sm={12} style={{ textAlign: "right", marginTop: 8 }}>
                {selectedStudents.length > 0 && (
                  <Space wrap>
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={handleSignSelected}
                      style={{ backgroundColor: "#52c41a" }}
                    >
                      Sign Selected ({selectedStudents.length})
                    </Button>
                    <Button
                      type="primary"
                      danger
                      icon={<UndoOutlined />}
                      onClick={handleUndoSelected}
                    >
                      Undo Selected ({selectedStudents.length})
                    </Button>
                  </Space>
                )}
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredStudents}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }} // enables horizontal scroll on small screens
            />
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default StudentRecord;
