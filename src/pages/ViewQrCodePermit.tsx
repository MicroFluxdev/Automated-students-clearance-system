import { useState } from "react";
import { Card, Tag, Typography, Row, Col, Avatar, Button, Divider } from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  BookOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  QrcodeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface StudentPermit {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  departmentDescription: string;
  examPermitStatus: "eligible" | "not_eligible" | "pending";
  examDate?: string;
  permitReceivedDate?: string;
  requirementsCompletedDate?: string;
}

const ViewQrCodePermit = () => {
  const [studentPermit] = useState<StudentPermit>({
    id: "1",
    studentName: "John Doe",
    studentId: "2024-001",
    department: "BS Computer Science",
    departmentDescription:
      "Bachelor of Science in Computer Science - Comprehensive study of computer systems, programming, and software development",
    examPermitStatus: "eligible",
    examDate: "March 25, 2025",
    permitReceivedDate: "March 15, 2025",
    requirementsCompletedDate: "March 10, 2025",
  });

  return (
    <div className="p-4 sm:p-6">
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card className="shadow-lg">
            <div className="mb-6 text-center sm:text-left">
              <Title
                level={2}
                className="text-blue-600 flex items-center justify-center sm:justify-start gap-2 text-xl sm:text-2xl"
              >
                <QrcodeOutlined />
                <span className="hidden sm:inline">
                  Student Exam Permit Verification
                </span>
                <span className="sm:hidden">Exam Permit</span>
              </Title>
              <Text type="secondary" className="text-sm">
                Verify student eligibility for examination access and view
                permit QR codes
              </Text>
            </div>

            <div className="space-y-6">
              {/* Student Information Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Title level={4} className="mb-4 flex items-center gap-2">
                  <UserOutlined className="text-blue-500" />
                  Student Information
                </Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <div className="text-center">
                      <Avatar
                        size={80}
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        alt={`${studentPermit.studentName}'s photo`}
                      />
                      <div className="mt-3">
                        <div className="font-semibold text-lg">
                          {studentPermit.studentName}
                        </div>
                        <Text type="secondary" className="text-sm">
                          Student
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={16}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <IdcardOutlined className="text-blue-500" />
                        <span className="font-medium">Student ID:</span>
                        <span>{studentPermit.studentId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MailOutlined className="text-blue-500" />
                        <span className="font-medium">Email:</span>
                        <span>john.doe@example.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneOutlined className="text-blue-500" />
                        <span className="font-medium">Phone:</span>
                        <span>+63 912 345 6789</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-blue-500" />
                        <span className="font-medium">Enrollment Date:</span>
                        <span>August 2024</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider />

              {/* Department Details Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                {/* <Title level={4} className="mb-4 flex items-center gap-2">
                  <BookOutlined className="text-blue-500" />
                  Department Details
                </Title> */}
                <div className="space-y-3">
                  <div className="font-medium flex items-center gap-2 text-lg">
                    <BookOutlined className="text-blue-500" />
                    {studentPermit.department}
                  </div>
                  <Text type="secondary" className="block">
                    {studentPermit.departmentDescription}
                  </Text>
                </div>
              </div>

              <Divider />

              {/* Exam Permit Status Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Title level={4} className="mb-4 flex items-center gap-2">
                  <CheckCircleOutlined className="text-blue-500" />
                  Exam Permit
                </Title>
                <div className="space-y-3">
                  <Tag
                    color={
                      studentPermit.examPermitStatus === "eligible"
                        ? "green"
                        : studentPermit.examPermitStatus === "pending"
                        ? "orange"
                        : "red"
                    }
                    icon={
                      studentPermit.examPermitStatus === "eligible" ? (
                        <CheckCircleOutlined />
                      ) : undefined
                    }
                    className="text-base px-3 py-1"
                  >
                    {studentPermit.examPermitStatus === "eligible"
                      ? "ELIGIBLE FOR EXAM"
                      : studentPermit.examPermitStatus === "pending"
                      ? "PENDING"
                      : "NOT ELIGIBLE"}
                  </Tag>
                  {studentPermit.examDate && (
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-blue-500" />
                      <Text type="secondary">
                        Exam Date: {studentPermit.examDate}
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Permit Timeline Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <Title level={4} className="mb-4 flex items-center gap-2">
                  <ClockCircleOutlined className="text-blue-500" />
                  Permit Timeline
                </Title>
                <div className="space-y-3">
                  {studentPermit.permitReceivedDate && (
                    <div className="flex items-center gap-2">
                      <QrcodeOutlined className="text-blue-500" />
                      <Text type="secondary">
                        Permit QR Code Received:{" "}
                        {studentPermit.permitReceivedDate}
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Actions Section */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                <Button
                  type="primary"
                  icon={<QrcodeOutlined />}
                  size="large"
                  disabled={studentPermit.examPermitStatus !== "eligible"}
                  className="flex-1 sm:flex-none"
                >
                  View QR Code
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  size="large"
                  className="flex-1 sm:flex-none"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewQrCodePermit;
