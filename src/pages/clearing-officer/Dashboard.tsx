import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Activity,
  PieChart,
  LineChart,
  Shield,
  Mail,
  LogOut,
} from "lucide-react";
import MonthlyAnalyticsChart from "../../components/Chart"; // Update path as needed

export default function Dashboard() {
  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-4">
      <div className="mx-auto">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BarChart2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-green-500 mt-1">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-red-500 mt-1">-2.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              <PieChart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64%</div>
              <p className="text-xs text-green-500 mt-1">
                +8.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <LineChart className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$32.4K</div>
              <p className="text-xs text-green-500 mt-1">
                +15.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MonthlyAnalyticsChart />

          <Card className="p-6">
            <CardHeader>
              <CardTitle className="text-center">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-500">
                <Shield size={16} className="mr-2" />
                <p>Account type: Premium</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail size={16} className="mr-2" />
                <p>your@email.com</p>
              </div>
              <Button variant="default" className="w-full mt-4">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
