import {
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Settings,
  NotebookPen,
} from "lucide-react";

import { CloseOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

interface CloseSidebarProps {
  closeSidebar: () => void;
}

export const SideMenu = ({ closeSidebar }: CloseSidebarProps) => {
  const location = useLocation();

  const navbar = [
    {
      to: "/clearing-officer",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/clearing-officer/courses",
      icon: <GraduationCap size={20} />,
      label: "Courses",
    },
    {
      to: "/clearing-officer/requirements",
      icon: <NotebookPen size={20} />,
      label: "Requirements",
    },
    {
      to: "/clearing-officer/events",
      icon: <Calendar size={20} />,
      label: "Events",
    },
    {
      to: "/clearing-officer/accountSettings",
      icon: <Settings size={20} />,
      label: "Account Settings",
    },
  ];

  return (
    <div className="flex h-screen flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl">
      <div className="px-6 py-8">
        <span
          onClick={closeSidebar}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300 absolute right-4 top-4"
        >
          <CloseOutlined size={20} />
        </span>
        <span className="flex justify-center items-center w-full rounded-xl mb-12 border-b border-white/10 pb-4">
          <div className="relative w-25 h-25  cursor-pointer hover:pause">
            <img
              src="/MF-logo.png"
              alt="Web Image"
              className="absolute w-25 h-25 [transform:rotateY(0deg)] [backface-visibility:hidden] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </div>
        </span>

        <ul className="space-y-2">
          {navbar.map(({ to, icon, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === to
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-blue-500/25"
                    : "hover:bg-white/10"
                }`}
              >
                {icon}
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/10">
        <div className="p-4 mx-4 my-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              className="size-10 rounded-full object-cover"
            />

            <div>
              <p className="font-medium text-sm text-white">Anthony Crausus</p>
              <p className="text-xs text-gray-400">anthony.dev@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
