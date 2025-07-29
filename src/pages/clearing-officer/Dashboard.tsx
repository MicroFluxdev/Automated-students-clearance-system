import {
  Mail,
  Shield,
  LogOut,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react";
import MonthlyAnalyticsChart from "../../components/Chart";

const Dashboard = () => {
  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-4">
      <div className=" mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Views
              </h3>
              <BarChart2 className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold mt-4">45.2K</p>
            <p className="text-green-500 text-sm mt-2">
              +12.5% from last month
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Engagement
              </h3>
              <Activity className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold mt-4">87%</p>
            <p className="text-red-500 text-sm mt-2">-2.3% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Conversion
              </h3>
              <PieChart className="text-green-500" />
            </div>
            <p className="text-3xl font-bold mt-4">64%</p>
            <p className="text-green-500 text-sm mt-2">+8.1% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
              <LineChart className="text-orange-500" />
            </div>
            <p className="text-3xl font-bold mt-4">$32.4K</p>
            <p className="text-green-500 text-sm mt-2">
              +15.2% from last month
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MonthlyAnalyticsChart />

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center"></div>
            <div className="mt-6">
              <div className="border-t border-gray-200 py-4 space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Shield size={16} className="mr-2" />
                  <p>Account type: </p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail size={16} className="mr-2" />
                </div>
              </div>
              <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
