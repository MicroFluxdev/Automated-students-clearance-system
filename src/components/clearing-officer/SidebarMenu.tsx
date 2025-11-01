import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  LayoutDashboard,
  GraduationCap,
  Calendar,
  Settings2,
  Book,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/authentication/useAuth";

const navbar = [
  {
    to: "/clearing-officer",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    to: "/clearing-officer/sao",
    icon: User,
    label: "Students",
  },
  {
    to: "/clearing-officer/requirements",
    icon: FileText,
    label: "Requirements",
  },
  {
    to: "/clearing-officer/viewCourses",
    icon: Book,
    label: "Courses",
  },
  {
    to: "/clearing-officer/clearance",
    icon: GraduationCap,
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
  const { user } = useAuth();

  console.log("lala", user?.role);

  const userName = `${user?.firstName} ${user?.lastName}`;

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
        "h-screen bg-[#00171f] transition-all duration-300 ease-in-out flex flex-col"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 animate-fade-in">
          <img
            className="h-12 w-12 rounded-md object-cover"
            src="/MICRO FLUX LOGO.png"
            alt="Menu icon"
          />
          <span className="font-semibold text-white">ASCS</span>
        </div>

        <button
          onClick={closeSidebar}
          className={cn(
            "lg:hidden h-8 w-8 items-center justify-center rounded-md",
            "bg-gray-100 hover:bg-blue-500 hover:text-white text-gray-700",
            "transition-all duration-300 hover:scale-110 active:scale-95"
          )}
        >
          <ChevronLeft className="h-4 w-4 inline-block" />
        </button>
      </div>

      {/* Search */}

      <div className="px-3 mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg bg-gray-50 pl-10 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 px-2 flex-1 overflow-y-auto">
        <h4 className="text-xs font-semibold text-gray-200 uppercase mb-2">
          Navigation
        </h4>

        <nav className="space-y-1">
          {navbar.map((item, index) => {
            // Hide `/clearing-officer/clearance` and `/clearing-officer/viewCourses` if user role is "sao"
            const shouldHideForSao =
              user?.role === "sao" &&
              (item.to === "/clearing-officer/clearance" ||
                item.to === "/clearing-officer/viewCourses");

            // Show `/clearing-officer/sao` and `/clearing-officer/sao/post-requirements` only for "sao" role
            const shouldHideForNonSao =
              user?.role !== "sao" &&
              (item.to === "/clearing-officer/sao" ||
                item.to === "/clearing-officer/requirements");

            if (shouldHideForSao || shouldHideForNonSao) {
              return null;
            }

            const active = isActive(item.to);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 group",
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-200 hover:bg-gray-800 hover:text-white"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-700 opacity-90 rounded-lg z-0" />
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
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className={cn("mt-auto px-4 py-4")}>
        <Link to="/clearing-officer/accountSettings">
          <div className="rounded-lg hover:bg-gray-800 p-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <img
                alt=""
                src="https://media.istockphoto.com/id/1327592449/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=yqoos7g9jmufJhfkbQsk-mdhKEsih6Di4WZ66t_ib7I="
                className="size-10 rounded-full object-cover"
              />

              <div>
                <p className="font-medium text-xs text-blue-600">{userName}</p>
                {/* <p className="text-xs text-gray-400">{user?.email}</p> */}
                <p className="text-xs text-gray-400">
                  {user?.role === "clearingOfficer"
                    ? "Clearing Officer"
                    : user?.role === "sao"
                    ? "SAO"
                    : "Who are you?"}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
