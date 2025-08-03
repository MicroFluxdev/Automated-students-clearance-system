// import {
//   LayoutDashboard,
//   GraduationCap,
//   Calendar,
//   Settings,
//   NotebookPen,
// } from "lucide-react";

// import { CloseOutlined } from "@ant-design/icons";
// import { Link, useLocation } from "react-router-dom";

// interface CloseSidebarProps {
//   closeSidebar: () => void;
// }

// export const SideMenu = ({ closeSidebar }: CloseSidebarProps) => {
//   const location = useLocation();

//   const navbar = [
//     {
//       to: "/clearing-officer",
//       icon: <LayoutDashboard size={20} />,
//       label: "Dashboard",
//     },
//     {
//       to: "/clearing-officer/courses",
//       icon: <GraduationCap size={20} />,
//       label: "Courses",
//     },
//     {
//       to: "/clearing-officer/requirements",
//       icon: <NotebookPen size={20} />,
//       label: "Requirements",
//     },
//     {
//       to: "/clearing-officer/events",
//       icon: <Calendar size={20} />,
//       label: "Events",
//     },
//     {
//       to: "/clearing-officer/accountSettings",
//       icon: <Settings size={20} />,
//       label: "Account Settings",
//     },
//   ];

//   return (
//     <div className="flex h-screen flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl">
//       <div className="px-6 py-8">
//         <span
//           onClick={closeSidebar}
//           className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-all duration-300 absolute right-4 top-4"
//         >
//           <CloseOutlined size={20} />
//         </span>
//         <span className="flex justify-center items-center w-full rounded-xl mb-12 border-b border-white/10 pb-4">
//           <div className="relative w-25 h-25  cursor-pointer hover:pause">
//             <img
//               src="/MF-logo.png"
//               alt="Web Image"
//               className="absolute w-25 h-25 [transform:rotateY(0deg)] [backface-visibility:hidden] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
//             />
//           </div>
//         </span>

//         <ul className="space-y-2">
//           {navbar.map(({ to, icon, label }) => (
//             <li key={to}>
//               <Link
//                 to={to}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
//                   location.pathname === to
//                     ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-blue-500/25"
//                     : "hover:bg-white/10"
//                 }`}
//               >
//                 {icon}
//                 <span className="font-medium">{label}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="border-t border-white/10">
//         <div className="p-4 mx-4 my-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
//           <div className="flex items-center gap-3">
//             <img
//               alt=""
//               src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
//               className="size-10 rounded-full object-cover"
//             />

//             <div>
//               <p className="font-medium text-sm text-white">Anthony Crausus</p>
//               <p className="text-xs text-gray-400">anthony.dev@gmail.com</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { NavLink, useLocation } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  Menu,
  LayoutDashboard,
  GraduationCap,
  NotebookPen,
  Calendar,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navbar = [
  {
    to: "/clearing-officer",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/clearing-officer/courses",
    icon: GraduationCap,
    label: "Courses",
  },
  {
    to: "/clearing-officer/requirements",
    icon: NotebookPen,
    label: "Requirements",
  },
  {
    to: "/clearing-officer/events",
    icon: Calendar,
    label: "Events",
  },
  {
    to: "/clearing-officer/accountSettings",
    icon: Settings2,
    label: "Account Settings",
  },
];
interface CloseSidebarProps {
  closeSidebar: () => void;
}

export function AppSidebar({ closeSidebar }: CloseSidebarProps) {
  const location = useLocation();

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/clearing-officer" && currentPath === "/clearing-officer")
      return true;
    if (path !== "/clearing-officer" && currentPath.startsWith(path))
      return true;
    return false;
  };

  return (
    <aside
      className={cn(
        "h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out flex flex-col"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center gap-2 animate-fade-in">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Menu className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800">SkyWave</span>
        </div>

        <button
          onClick={closeSidebar}
          className={cn(
            "lg:hidden h-8 w-8 items-center justify-center rounded-md",
            "bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-700",
            "transition-all duration-300 hover:scale-110 active:scale-95"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}

      <div className="px-4 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 px-2 flex-1 overflow-y-auto">
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Navigation
        </h4>

        <nav className="space-y-1">
          {navbar.map((item, index) => {
            const active = isActive(item.to);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 group",
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-300/40"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-90 rounded-lg z-0" />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 z-10 relative",
                    active && "animate-pulse-glow"
                  )}
                />

                <span className="z-10 relative animate-fade-in">
                  {item.label}
                </span>

                <div
                  className={cn(
                    "absolute inset-0 rounded-lg bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    active && "opacity-0"
                  )}
                />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn("mt-auto px-4 py-4")}>
        {/* // <div className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-3 animate-fade-in">
          //   <h4 className="text-sm font-medium text-blue-700 mb-1">
          //     Upgrade to Pro
          //   </h4>
          //   <p className="text-xs text-blue-600 mb-2">
          //     Get access to all features
          //   </p>
          //   <button className="w-full rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95">
          //     Upgrade Now
          //   </button>
          // </div> */}
        <div className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 p-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              className="size-10 rounded-full object-cover"
            />

            <div>
              <p className="font-medium text-xs text-blue-600">
                Anthony Crausus
              </p>
              <p className="text-xs text-gray-400">anthony.dev@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
