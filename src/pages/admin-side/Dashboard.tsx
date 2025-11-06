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
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/authentication/useAuth";
import {
  fetchDashboardStats,
  getDaysUntilDeadline,
  getCompletionRate,
  type DashboardStats,
} from "@/services/dashboardService";
import StudentsByYearChart from "@/components/dashboard/StudentsByYearChart";
import RequirementsStatusChart from "@/components/dashboard/RequirementsStatusChart";
import OfficersByRoleChart from "@/components/dashboard/OfficersByRoleChart";

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardStats();
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

  // Calculate derived metrics
  const completionRate = stats ? getCompletionRate(stats) : 0;
  const daysUntilDeadline = stats
    ? getDaysUntilDeadline(stats.activeClearance)
    : 0;

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
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
            >
              Enrolled in the system
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Clearing Officers"
              value={stats.totalClearingOfficers}
              prefix={<TeamOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
            <div
              style={{ color: "#8c8c8c", fontSize: "14px", marginTop: "8px" }}
            >
              Active officers
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={completionRate}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{
                color: completionRate >= 50 ? "#3f8600" : "#cf1322",
              }}
            />
            <div
              style={{
                color: completionRate >= 50 ? "#3f8600" : "#cf1322",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {stats.requirementStats.signed} of {stats.requirementStats.total}{" "}
              requirements signed
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Days Until Deadline"
              value={daysUntilDeadline}
              suffix="days"
              prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
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
          <StudentsByYearChart data={stats.studentsByYearLevel} />
        </Col>

        <Col xs={24} lg={12}>
          <RequirementsStatusChart data={stats.requirementStats} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={16}>
          <OfficersByRoleChart data={stats.officersByRole} />
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
                  {user?.role || "Admin"}
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

export default AdminDashboard;
