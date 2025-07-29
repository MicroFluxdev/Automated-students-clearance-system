import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [12000, 19000, 3000, 5000, 20000, 30000],
      backgroundColor: "rgba(99, 102, 241, 0.8)",
      borderColor: "rgba(99, 102, 241, 1)",
      borderWidth: 2,
      borderRadius: 12,
      hoverBackgroundColor: "rgba(99, 102, 241, 1)",
      hoverBorderColor: "rgba(99, 102, 241, 1)",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        font: {
          size: 14,
          weight: "600" as const,
        },
        padding: 20,
      },
    },
    title: {
      display: true,
      text: "Monthly Revenue (USD)",
      font: {
        size: 18,
        weight: "bold" as const,
      },
      padding: 20,
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      titleColor: "#1F2937",
      bodyColor: "#1F2937",
      borderColor: "rgba(99, 102, 241, 0.2)",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    y: {
      grid: {
        display: true,
        color: "rgba(0, 0, 0, 0.05)",
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
};

const MonthlyAnalyticsChart = () => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        Monthly Analytics
      </h3>
      <div className="h-80 bg-white rounded-lg flex items-center justify-center">
        <Bar
          data={data}
          options={{
            ...options,
            plugins: {
              ...options.plugins,
              legend: {
                ...options.plugins.legend,
                labels: {
                  ...options.plugins.legend.labels,
                  font: {
                    ...options.plugins.legend.labels.font,
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MonthlyAnalyticsChart;
