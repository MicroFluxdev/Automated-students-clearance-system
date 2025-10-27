import { useState } from "react";
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
  // State for View Requirements Modal
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequirement, setSelectedRequirement] =
    useState<RequirementData | null>(null);

  // Handler to open view modal
  const handleViewRequirements = (record: RequirementData) => {
    setSelectedRequirement(record);
    setViewModalVisible(true);
  };

  // Handler to close view modal
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
        <Space wrap>
          <div className="text-sm text-gray-500">{record.description}</div>
        </Space>
      ),
    },
    // {
    //   title: "Departments",
    //   dataIndex: "department",
    //   key: "department",
    //   render: (department: string) => {
    //     if (!department || department.trim() === "") {
    //       return <span className="text-gray-400">None</span>;
    //     }

    //     // Split departments by comma and trim whitespace
    //     const departments = department
    //       .split(",")
    //       .map((dept) => dept.trim())
    //       .filter((dept) => dept !== "");

    //     return (
    //       <div className="flex flex-col gap-1">
    //         <Tag color="orange" className="text-center" title={departments[0]}>
    //           {departments[0]}
    //         </Tag>
    //         {departments.length > 1 && (
    //           <Tooltip
    //             title={
    //               <div className="bg-white rounded-lg shadow-sm p-2 max-h-56 overflow-auto">
    //                 <div className="divide-y divide-gray-100">
    //                   {departments.slice(1).map((dept) => (
    //                     <div
    //                       key={dept}
    //                       className="py-2 px-3 text-sm text-gray-700"
    //                     >
    //                       <span className="inline-block w-2 mr-2 text-orange-500">
    //                         •
    //                       </span>
    //                       <span>{dept}</span>
    //                     </div>
    //                   ))}
    //                 </div>
    //               </div>
    //             }
    //           >
    //             <span className="text-xs text-blue-600 cursor-pointer hover:underline">
    //               +{departments.length - 1} more
    //             </span>
    //           </Tooltip>
    //         )}
    //       </div>
    //     );
    //   },
    //   responsive: ["sm", "md", "lg", "xl"],
    // },

    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      render: (_, record) => (
        <Space wrap direction="vertical">
          <Tag color="purple">{record.semester || "Not specified"}</Tag>
          <Tag color="green">{record.yearLevel || "Not specified"}</Tag>
        </Space>
      ),
      responsive: ["sm", "md", "lg", "xl"],
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
                    <div className="flex flex-col gap-2">
                      {requirements.slice(1).map((req, idx) => (
                        <div
                          key={idx}
                          className="flex items-start text-sm text-gray-700"
                        >
                          <span className="mr-2 text-orange-500 font-bold">
                            •
                          </span>
                          <span className="leading-tight">{req}</span>
                        </div>
                      ))}
                    </div>
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
      responsive: ["md"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
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
      responsive: ["lg"] as ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[],
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
                description="Are you sure you want to delete this requirement? This action cannot be undone."
                onConfirm={() => onDelete?.(record)}
                okText="Yes, delete"
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
      <Card
        title="Requirements"
        style={{ marginBottom: "16px", marginTop: "16px" }}
      >
        <Spin spinning={loading}>
          <Table<RequirementData>
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record._id || record.id || record.courseCode}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} requirements`,
              pageSizeOptions: ["5", "10", "20", "50"],

              className: "px-4 py-3",
            }}
            scroll={{
              x: "max-content",
              y: undefined,
            }}
            bordered
          />
        </Spin>
      </Card>

      {/* View Requirements Modal */}
      <ViewRequirementsModal
        visible={viewModalVisible}
        requirement={selectedRequirement}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default RequirementsTable;
