import { Card } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface RequirementsBySemesterChartProps {
  data: {
    [semester: string]: number;
  };
}

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"];

const RequirementsBySemesterChart = ({ data }: RequirementsBySemesterChartProps) => {
  // Transform data for recharts
  const chartData = Object.entries(data)
    .map(([semester, count], index) => ({
      semester,
      requirements: count,
      fill: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => {
      // Sort by semester order (1st, 2nd, Summer, etc.)
      const order = ["1st", "2nd", "Summer", "Mid-Year"];
      const aIndex = order.findIndex(s => a.semester.includes(s));
      const bIndex = order.findIndex(s => b.semester.includes(s));

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      return a.semester.localeCompare(b.semester);
    });

  return (
    <Card title="Requirements by Semester" style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="semester" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="requirements" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RequirementsBySemesterChart;
