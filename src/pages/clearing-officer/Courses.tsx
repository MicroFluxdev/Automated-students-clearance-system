import { useState } from "react";
import {
  Input,
  Card,
  Button,
  Select,
  Space,
  Tag,
  Row,
  Col,
  Typography,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ReadOutlined,
  UserOutlined,
  FilterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

interface Course {
  title: string;
  details: string;
  dueDate: string;
  completed: boolean;
  students: number;
  category: string;
}

const requirements: Course[] = [
  {
    title: "CC107",
    details: "Submit a 3-page proposal outlining the project scope.",
    dueDate: "March 20, 2025",
    completed: true,
    students: 45,
    category: "Computer Science",
  },
  {
    title: "CC107",
    details: "Submit a 3-page proposal outlining the project scope.",
    dueDate: "March 20, 2025",
    completed: false,
    students: 45,
    category: "Software Engineering",
  },
  {
    title: "SE107",
    details: "Submit a 3-page proposal outlining the project scope.",
    dueDate: "March 20, 2025",
    completed: false,
    students: 45,
    category: "Computer Science",
  },
  {
    title: "CC107",
    details: "Submit a 3-page proposal outlining the project scope.",
    dueDate: "March 20, 2025",
    completed: false,
    students: 45,
    category: "Software Engineering",
  },
];

const Courses = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    "Computer Science",
    "Software Engineering",
    "Information Systems",
  ];

  const filteredRequirements = requirements.filter(
    (req) =>
      (req.title.toLowerCase().includes(search.toLowerCase()) ||
        req.details.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "all" || req.category === selectedCategory)
  );

  return (
    <div style={{ padding: 24 }}>
      {/* Header Section */}
      <Row align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space align="center">
            <ReadOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={2} style={{ margin: 0 }}>
              Courses
            </Title>
          </Space>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          {/* Left side: Search */}
          <Col flex="1 1 300px" style={{ minWidth: 200, maxWidth: 400 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          {/* Right side: Category Select and Filter Icon */}
          <Col>
            <Space>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ minWidth: 180 }}
              >
                {categories.map((category) => (
                  <Select.Option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Select.Option>
                ))}
              </Select>
              <FilterOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Course Grid */}
      {filteredRequirements.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <FileTextOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
          <Title level={4} style={{ marginTop: 16, color: "#888" }}>
            No student course
          </Title>
          <Typography.Text type="secondary">
            There are currently no student courses to display.
          </Typography.Text>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredRequirements.map((req, index) => (
            <Col xs={24} sm={24} md={12} lg={8} key={index}>
              <Card hoverable>
                {/* Course Header */}
                <Row
                  justify="space-between"
                  align="top"
                  style={{ marginBottom: 16 }}
                >
                  <Col>
                    <Space>
                      <div
                        style={{
                          padding: 8,
                          backgroundColor: "#e6f7ff",
                          borderRadius: 8,
                        }}
                      >
                        <FileTextOutlined
                          style={{ fontSize: 20, color: "#1890ff" }}
                        />
                      </div>
                      <div>
                        <Title level={4} style={{ margin: 0 }}>
                          {req.title}
                        </Title>
                        <Typography.Text type="secondary">
                          {req.category}
                        </Typography.Text>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Tag color={req.completed ? "success" : "warning"}>
                      {req.completed ? "Completed" : "In Progress"}
                    </Tag>
                  </Col>
                </Row>

                {/* Course Info */}
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Space>
                    <EditOutlined style={{ color: "#722ed1" }} />
                    <Typography.Text>{req.details}</Typography.Text>
                  </Space>
                  <Space>
                    <CalendarOutlined style={{ color: "#722ed1" }} />
                    <Typography.Text>{req.dueDate}</Typography.Text>
                  </Space>
                  <Space>
                    <UserOutlined style={{ color: "#52c41a" }} />
                    <Typography.Text>
                      {req.students} students enrolled
                    </Typography.Text>
                  </Space>
                </Space>

                {/* Action Button */}
                <Link
                  to="/clearing-officer/student-records"
                  style={{ display: "block", marginTop: 16 }}
                >
                  <Button type="primary" block>
                    Student Records
                  </Button>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Courses;
