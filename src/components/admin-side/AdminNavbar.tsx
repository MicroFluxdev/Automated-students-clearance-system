import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import { ScanOutlined } from "@ant-design/icons";
import { useState } from "react";
import NotificationDrawer from "../NotificationDrawer";
import { useAuth } from "@/authentication/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function AdminNavbar({ toggleSidebar }: NavbarProps) {
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      // Optionally handle error (e.g., show notification)
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side: Logo and Navigation */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-white/10 mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-bold text-xl mr-8 px-4 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors duration-200"
            >
              <span>
                {location.pathname === "/dashboard"
                  ? "Dashboard"
                  : location.pathname === "/dashboard/gallery"
                  ? "Gallery"
                  : "Dashboard"}
              </span>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200">
              <ScanOutlined className="text-lg" />
              <span>QR Code</span>
            </div>
          </div>

          {/* Right Side: Notifications and Logout */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <NotificationDrawer
        open={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </nav>
  );
}
