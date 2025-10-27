import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Tooltip,
  Card,
  Spin,
  Dropdown,
  type MenuProps,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
  DownOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import ViewRequirementsModal from "./ViewRequirementsModal";
import { getAllStudentSpecificSubject } from "@/services/intigration.services";

interface RequirementsTableProps {
  data: RequirementData[];
  loading?: boolean;
  onEdit?: (record: RequirementData) => void;
  onDelete?: (record: RequirementData) => void;
  onView?: (record: RequirementData) => void;
}

export interface RequirementData {
  _id?: string;
  id?: string;
  userId?: string;
  courseCode: string;
  courseName: string;
  yearLevel: string;
  semester: string;
  department: string;
  requirements: string[];
  dueDate: string;
  description?: string;
  completed?: boolean;
  students?: number;
  createdAt?: string;
  updatedAt?: string;
}

const RequirementsTable: React.FC<RequirementsTableProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete,
  onView,
}) => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequirement, setSelectedRequirement] =
    useState<RequirementData | null>(null);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>(
    {}
  );
  const [isFetchingCounts, setIsFetchingCounts] = useState(false);

  // 🔹 Fetch student count for each courseCode
  useEffect(() => {
    const fetchStudentCounts = async () => {
      if (data.length === 0) return;

      setIsFetchingCounts(true);
      try {
        const counts: Record<string, number> = {};

        // Fetch student counts for each course in parallel
        await Promise.all(
          data.map(async (req) => {
            try {
              const res = await getAllStudentSpecificSubject(req.courseCode);

              const students = Array.isArray(res) ? res : res.data || [];
              counts[req.courseCode] = students.length || 0;
              console.log(
                `✓ Course ${req.courseCode}: ${students.length} students`
              );
            } catch (error: unknown) {
              const axiosError = error as {
                response?: { status?: number };
                message?: string;
              };
              if (
                axiosError?.response?.status === 404 ||
                axiosError?.message?.includes("No students found")
              ) {
                counts[req.courseCode] = 0;
                console.log(
                  `✓ Course ${req.courseCode}: 0 students (no enrollments yet)`
                );
              } else {
                console.error(
                  `✗ Error fetching students for ${req.courseCode}:`,
                  axiosError?.message || error
                );
                counts[req.courseCode] = 0;
              }
            }
          })
        );

        console.log("Student counts loaded:", counts);
        setStudentCounts(counts);
      } catch (error) {
        console.error("Error fetching student counts:", error);
      } finally {
        setIsFetchingCounts(false);
      }
    };

    fetchStudentCounts();
  }, [data]);

  const tableData: RequirementData[] = data.map((req) => ({
    ...req,
    students: studentCounts[req.courseCode] || 0,
  }));

  // 🔹 Handlers
  const handleViewRequirements = (record: RequirementData) => {
    setSelectedRequirement(record);
    setViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedRequirement(null);
  };

  const columns: ColumnsType<RequirementData> = [
    {
      title: "Course",
      key: "course",
      width: 300,
      sorter: (a, b) => a.courseCode.localeCompare(b.courseCode),
      render: (_: unknown, record: RequirementData) => (
        <Space wrap>
          <BookOutlined className="text-blue-500" />
          <div>
            <div className="font-medium">{record.courseCode}</div>
            <div className="text-sm text-gray-500">{record.courseName}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Description",
      key: "description",
      width: 400,
      render: (_: unknown, record: RequirementData) => (
        <div className="text-sm text-gray-500">{record.description}</div>
      ),
    },
    {
      title: "Semester / Year",
      key: "semester",
      render: (_, record) => (
        <Space wrap direction="vertical">
          <Tag color="purple">{record.semester || "Not specified"}</Tag>
          <Tag color="green">{record.yearLevel || "Not specified"}</Tag>
        </Space>
      ),
    },
    {
      title: "Requirements",
      dataIndex: "requirements",
      key: "requirements",
      render: (_, record) => {
        const { requirements } = record;

        if (!requirements || requirements.length === 0) {
          return <span className="text-gray-400">None</span>;
        }

        return (
          <div className="flex flex-col gap-1">
            <Tag color="orange" className="text-xs font-medium">
              {requirements[0]}
            </Tag>
            {requirements.length > 1 && (
              <Tooltip
                title={
                  <div className="bg-white rounded-lg p-3 shadow-sm max-h-56 overflow-auto">
                    {requirements.slice(1).map((req, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        • {req}
                      </div>
                    ))}
                  </div>
                }
              >
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                  +{requirements.length - 1} more
                </span>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      render: (date: string) => {
        const formattedDate = format(new Date(date), "MMM dd, yyyy");
        const isOverdue = new Date(date) < new Date();
        return (
          <Space>
            <CalendarOutlined />
            <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
              {formattedDate}
            </span>
          </Space>
        );
      },
    },
    {
      title: "Students",
      dataIndex: "students",
      key: "students",
      align: "center",
      sorter: (a, b) => (a.students || 0) - (b.students || 0),
      render: (students: number = 0) => (
        <Space>
          <TeamOutlined />
          <span>{students}</span>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: RequirementData) => {
        const viewMenuItems: MenuProps["items"] = [
          {
            key: "view-student",
            label: (
              <Link to="/clearing-officer/student-records">
                <Space>
                  <UserOutlined />
                  View Student
                </Space>
              </Link>
            ),
            onClick: () => onView?.(record),
          },
          {
            key: "view-requirements",
            label: (
              <Space>
                <FileTextOutlined />
                View Requirements
              </Space>
            ),
            onClick: () => handleViewRequirements(record),
          },
        ];

        return (
          <Space size="small" wrap>
            <Dropdown menu={{ items: viewMenuItems }} trigger={["click"]}>
              <Button icon={<EyeOutlined />} size="small">
                View <DownOutlined />
              </Button>
            </Dropdown>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit?.(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this requirement?"
                onConfirm={() => onDelete?.(record)}
                okText="Yes"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <Card title="Requirements" style={{ marginBottom: "16px" }}>
        <Spin spinning={loading || isFetchingCounts}>
          <Table<RequirementData>
            columns={columns}
            dataSource={tableData}
            loading={loading || isFetchingCounts}
            rowKey={(record) => record._id || record.id || record.courseCode}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            scroll={{ x: "max-content" }}
            bordered
          />
        </Spin>
      </Card>

      <ViewRequirementsModal
        visible={viewModalVisible}
        requirement={selectedRequirement}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default RequirementsTable;
