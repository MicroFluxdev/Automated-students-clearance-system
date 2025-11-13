import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Spin,
  Alert,
  Typography,
} from "antd";
import {
  MailOutlined,
  SafetyOutlined,
  LogoutOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/authentication/useAuth";
import {
  fetchClearingOfficerDashboardStats,
  getDaysUntilDeadline,
  type ClearingOfficerDashboardStats,
} from "@/services/clearingOfficerDashboardService";
import MyRequirementsStatusChart from "@/components/dashboard/clearing-officer/MyRequirementsStatusChart";
import RecentSubmissionsTable from "@/components/dashboard/clearing-officer/RecentSubmissionsTable";
import StudentsByYearChart from "@/components/dashboard/StudentsByYearChart";
import {
  fetchDashboardStats,
  type DashboardStats,
} from "@/services/dashboardService";

const { Title, Text } = Typography;

const ClearingOfficerDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<ClearingOfficerDashboardStats | null>(
    null
  );
  const [yearLevelStats, setYearLevelStats] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchClearingOfficerDashboardStats();
        setStats(data);

        console.log(data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };
    const yearLevelStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardStats();
        setYearLevelStats(data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    yearLevelStudent();

    loadDashboardData();
  }, []);

  // Calculate derived metrics
  const daysUntilDeadline = stats
    ? getDaysUntilDeadline(stats.activeClearance)
    : 0;

  // Get and format deadline date
  const deadlineDate = stats?.activeClearance
    ? stats.activeClearance.extendedDeadline || stats.activeClearance.deadline
    : null;

  const formattedDeadlineDate = deadlineDate
    ? new Date(deadlineDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] pt-12 w-full ">
        <Spin size="large">
          <div className="w-full h-30" />
        </Spin>
        <span className="text-lg text-blue-500  tracking-wide">
          Loading dashboard data...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error Loading Dashboard"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // No data state
  if (!stats) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="No Data Available"
          description="Unable to load dashboard statistics. Please try again later."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  // Guards used by lower sections
  const hasRecentSubmissions =
    stats && (stats.recentSubmissions?.length || 0) > 0;

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>
        Dashboard
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {/* Total Students */}
        <Col xs={24} md={8} lg={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
            >
              Students I manage
            </div>
          </Card>
        </Col>

        {/* Total Signed */}
        <Col xs={24} md={8} lg={8}>
          <Card>
            <Statistic
              title="Total Signed"
              value={stats.myRequirementStats.signed}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
            >
              Requirements approved
            </div>
          </Card>
        </Col>

        {/* Clearance Deadline */}
        <Col xs={24} md={8} lg={8}>
          <Card style={{ position: "relative" }}>
            {formattedDeadlineDate && (
              <div className="absolute top-4 right-4 text-gray-500 text-sm font-medium text-right">
                {formattedDeadlineDate}
              </div>
            )}
            <Statistic
              title="Days Until Deadline"
              value={daysUntilDeadline}
              suffix="days"
              prefix={<CalendarOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{
                color: daysUntilDeadline > 7 ? "#3f8600" : "#cf1322",
              }}
            />
            <div
              style={{
                color: daysUntilDeadline > 7 ? "#8c8c8c" : "#cf1322",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {stats.activeClearance
                ? `${stats.activeClearance.semesterType} ${stats.activeClearance.academicYear}`
                : "No active clearance"}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={12}>
          <StudentsByYearChart
            data={
              yearLevelStats?.studentsByYearLevel ?? {
                "1st Year": 0,
                "2nd Year": 0,
                "3rd Year": 0,
                "4th Year": 0,
              }
            }
          />
        </Col>

        <Col xs={24} lg={12}>
          <MyRequirementsStatusChart data={stats.myRequirementStats} />
        </Col>
      </Row>

      {/* Recent Submissions and Account Info */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={16}>
          {hasRecentSubmissions ? (
            <RecentSubmissionsTable data={stats.recentSubmissions} />
          ) : (
            <Card title="My Requirements Summary" style={{ height: "100%" }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                  <Statistic
                    title="Total"
                    value={stats.myRequirementStats.total}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Statistic
                    title="Signed"
                    value={stats.myRequirementStats.signed}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Statistic
                    title="Pending"
                    value={stats.myRequirementStats.pending}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Statistic
                    title="Incomplete"
                    value={stats.myRequirementStats.incomplete}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Statistic
                    title="Missing"
                    value={stats.myRequirementStats.missing}
                    valueStyle={{ color: "#f5222d" }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </Col>

        {/* User Account Card */}
        <Col xs={24} lg={8}>
          <Card title="Account Information">
            <div style={{ marginTop: "8px" }}>
              <div style={{ marginBottom: "16px" }}>
                <Text strong>Name:</Text>
                <br />
                <Text>
                  {user?.firstName} {user?.lastName}
                </Text>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <SafetyOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  <Text strong>Role:</Text>
                </div>
                <Text style={{ marginLeft: "24px" }}>
                  {user?.role || "Clearing Officer"}
                </Text>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <MailOutlined
                    style={{ marginRight: "8px", color: "#1890ff" }}
                  />
                  <Text strong>Email:</Text>
                </div>
                <Text style={{ marginLeft: "24px" }}>{user?.email}</Text>
              </div>

              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                style={{ width: "100%" }}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClearingOfficerDashboard;
