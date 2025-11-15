import { Card } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface StudentsByYearChartProps {
  data: {
    "1st Year": number;
    "2nd Year": number;
    "3rd Year": number;
    "4th Year": number;
  };
}

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d"];

const StudentsByYearChart = ({ data }: StudentsByYearChartProps) => {
  // Transform data for recharts
  const chartData = [
    { yearLevel: "1st Year", students: data["1st Year"], fill: COLORS[0] },
    { yearLevel: "2nd Year", students: data["2nd Year"], fill: COLORS[1] },
    { yearLevel: "3rd Year", students: data["3rd Year"], fill: COLORS[2] },
    { yearLevel: "4th Year", students: data["4th Year"], fill: COLORS[3] },
  ];

  return (
    <Card title="Students by Year Level" style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="yearLevel" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="students" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default StudentsByYearChart;
