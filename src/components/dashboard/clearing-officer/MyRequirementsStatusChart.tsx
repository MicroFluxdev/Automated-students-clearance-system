import { Card } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MyRequirementsStatusChartProps {
  data: {
    signed: number;
    incomplete: number;
    missing: number;
    pending: number;
    total: number;
  };
}

const COLORS = {
  signed: "#52c41a",
  incomplete: "#faad14",
  missing: "#f5222d",
  pending: "#1890ff",
};

const STATUS_LABELS = {
  signed: "Signed",
  incomplete: "Incomplete",
  missing: "Missing",
  pending: "Pending Review",
};

const MyRequirementsStatusChart = ({ data }: MyRequirementsStatusChartProps) => {
  // Transform data for recharts
  const chartData = [
    { name: STATUS_LABELS.signed, value: data.signed, color: COLORS.signed },
    { name: STATUS_LABELS.incomplete, value: data.incomplete, color: COLORS.incomplete },
    { name: STATUS_LABELS.missing, value: data.missing, color: COLORS.missing },
    { name: STATUS_LABELS.pending, value: data.pending, color: COLORS.pending },
  ].filter((item) => item.value > 0); // Only show statuses with values

  return (
    <Card title="My Requirements Status Distribution" style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            innerRadius={40} // Creates a donut chart
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MyRequirementsStatusChart;
