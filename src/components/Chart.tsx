// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const data = {
//   labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//   datasets: [
//     {
//       label: "Revenue",
//       data: [12000, 19000, 3000, 5000, 20000, 30000],
//       backgroundColor: "rgba(59, 130, 246, 0.8)", // blue-500 at 80%
//       borderColor: "rgba(59, 130, 246, 1)", // blue-500 at 100%
//       borderWidth: 2,
//       borderRadius: 12,
//       hoverBackgroundColor: "rgba(59, 130, 246, 1)", // full blue
//       hoverBorderColor: "rgba(59, 130, 246, 1)",
//     },
//   ],
// };

// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "top" as const,
//       labels: {
//         font: {
//           size: 14,
//           weight: "600" as const,
//         },
//         padding: 20,
//       },
//     },
//     title: {
//       display: true,
//       text: "Monthly Revenue (USD)",
//       font: {
//         size: 18,
//         weight: "bold" as const,
//       },
//       padding: 20,
//     },
//     tooltip: {
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       titleColor: "#1F2937",
//       bodyColor: "#1F2937",
//       borderColor: "rgba(99, 102, 241, 0.2)",
//       borderWidth: 1,
//       padding: 12,
//       cornerRadius: 8,
//       displayColors: false,
//     },
//   },
//   scales: {
//     y: {
//       grid: {
//         display: true,
//         color: "rgba(0, 0, 0, 0.05)",
//       },
//       ticks: {
//         font: {
//           size: 12,
//         },
//       },
//     },
//     x: {
//       grid: {
//         display: false,
//       },
//       ticks: {
//         font: {
//           size: 12,
//         },
//       },
//     },
//   },
// };

// const MonthlyAnalyticsChart = () => {
//   return (
//     <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
//       <h3 className="text-2xl font-bold mb-6 text-gray-800">
//         Monthly Analytics
//       </h3>
//       <div className="h-80 bg-white rounded-lg flex items-center justify-center">
//         <Bar
//           data={data}
//           options={{
//             ...options,
//             plugins: {
//               ...options.plugins,
//               legend: {
//                 ...options.plugins.legend,
//                 labels: {
//                   ...options.plugins.legend.labels,
//                   font: {
//                     ...options.plugins.legend.labels.font,
//                     weight: "bold",
//                   },
//                 },
//               },
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default MonthlyAnalyticsChart;
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
export const description = "An area chart with gradient fill";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;
export default function ChartAreaGradient() {
  return (
    <Card className="lg:col-span-2 bg-white rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle>Area Chart - Gradient</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
