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
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/authentication/useAuth";
import {
  fetchClearingOfficerDashboardStats,
  type ClearingOfficerDashboardStats,
} from "@/services/clearingOfficerDashboardService";
import RequirementsBySemesterChart from "@/components/dashboard/clearing-officer/RequirementsBySemesterChart";
import MyRequirementsStatusChart from "@/components/dashboard/clearing-officer/MyRequirementsStatusChart";
import RecentSubmissionsTable from "@/components/dashboard/clearing-officer/RecentSubmissionsTable";

const { Title, Text } = Typography;

const ClearingOfficerDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<ClearingOfficerDashboardStats | null>(
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
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Derived metrics (none for deadline; hidden per request)
  const clearanceDeadlineDate = stats?.activeClearance
    ? new Date(
        (stats.activeClearance.extendedDeadline ||
          stats.activeClearance.deadline) as unknown as string
      )
    : null;
  const clearanceDeadlineLabel = clearanceDeadlineDate
    ? clearanceDeadlineDate.toLocaleDateString()
    : "No deadline";

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
      <div
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Loading dashboard data..." />
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
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.totalCourses}
              prefix={<BookOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
            >
              Courses I manage
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Total Departments"
              value={stats.totalDepartments}
              prefix={<TeamOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
            >
              Unique departments
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Total Year Levels"
              value={stats.totalYearLevels}
              prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
            >
              Year levels covered
            </div>
          </Card>
        </Col>

        {/* Clearance Deadline */}
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Clearance Deadline"
              value={clearanceDeadlineLabel}
              prefix={<CalendarOutlined style={{ color: "#fa8c16" }} />}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
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
          <RequirementsBySemesterChart data={stats.myRequirementsBySemester} />
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
