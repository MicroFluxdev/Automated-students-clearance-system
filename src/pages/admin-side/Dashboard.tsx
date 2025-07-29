import { Card, Row, Col, Statistic, Button } from "antd";
import {
  MailOutlined,
  SafetyOutlined,
  LogoutOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import MonthlyAnalyticsChart from "../../components/Chart";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Total Views"
              value={45.2}
              suffix="K"
              prefix={<BarChartOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div style={{ color: "#3f8600", fontSize: "14px" }}>
              +12.5% from last month
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Engagement"
              value={87}
              suffix="%"
              prefix={
                <FundProjectionScreenOutlined style={{ color: "#722ed1" }} />
              }
              valueStyle={{ color: "#cf1322" }}
            />
            <div style={{ color: "#cf1322", fontSize: "14px" }}>
              -2.3% from last month
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Conversion"
              value={64}
              suffix="%"
              prefix={<PieChartOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div style={{ color: "#3f8600", fontSize: "14px" }}>
              +8.1% from last month
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={32.4}
              suffix="K"
              prefix={<LineChartOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div style={{ color: "#3f8600", fontSize: "14px" }}>
              +15.2% from last month
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={16}>
          <MonthlyAnalyticsChart />
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <div style={{ marginTop: "24px" }}>
              <div
                style={{ borderTop: "1px solid #f0f0f0", padding: "16px 0" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <SafetyOutlined style={{ marginRight: "8px" }} />
                  <span>Account type: </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MailOutlined style={{ marginRight: "8px" }} />
                  <span>Email</span>
                </div>
              </div>
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                style={{ width: "100%", marginTop: "24px" }}
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
