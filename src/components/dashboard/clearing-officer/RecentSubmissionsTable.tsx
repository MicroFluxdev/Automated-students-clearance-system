import { Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { StudentRequirement } from "@/services/studentRequirementService";
import { formatDate } from "@/lib/utils";

interface RecentSubmissionsTableProps {
  data: StudentRequirement[];
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case "signed":
      return "green";
    case "incomplete":
      return "orange";
    case "missing":
      return "red";
    default:
      return "blue";
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case "signed":
      return "Signed";
    case "incomplete":
      return "Incomplete";
    case "missing":
      return "Missing";
    default:
      return "Pending";
  }
};

const RecentSubmissionsTable = ({ data }: RecentSubmissionsTableProps) => {
  const columns: ColumnsType<StudentRequirement> = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      width: 120,
    },
    {
      title: "Requirement",
      dataIndex: ["requirement", "courseName"],
      key: "requirementName",
      ellipsis: true,
      render: (_: unknown, record: StudentRequirement) =>
        record.requirement?.courseName || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      render: (date: string) => date ? formatDate(date) : "N/A",
    },
  ];

  return (
    <Card title="Recent Submissions" style={{ height: "100%" }}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.studentId}-${record.requirementId}`}
        pagination={false}
        size="small"
        scroll={{ y: 240 }}
        locale={{ emptyText: "No recent submissions" }}
      />
    </Card>
  );
};

export default RecentSubmissionsTable;
