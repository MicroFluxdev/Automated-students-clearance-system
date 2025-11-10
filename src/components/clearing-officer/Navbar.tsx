import { BellIcon, LogOut, Menu, QrCode, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import NotificationDrawer from "../NotificationDrawer";
import { useAuth } from "../../authentication/useAuth";

interface NavbarProps {
  toggleSidebar: () => void;
}
const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { logout, user } = useAuth();

  const notificationCount = 3;

  // const handleLogout = () => {
  //   console.log("Logging out...");
  // };

  // const handleNotificationClick = () => {
  //   console.log("Opening notifications...");
  //   setIsNotificationOpen(true); // this was missing
  // };

  return (
    <nav>
      {/* backdrop-blur-md border-b border-border/50 */}
      <div className=" bg-white backdrop-blur-md border-b border-border/50 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <Button
            onClick={toggleSidebar}
            className="lg:hidden rounded-md hover:bg-gray-100 mr-2"
            variant="ghost"
          >
            <Menu className="h-12 w-12" />
          </Button>
          <div className="flex flex-shrink-0">
            {/* <h1 className="text-xl font-bold text-foreground">Your App</h1> */}
            {/* Search bar or other center content */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <QrCode className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">QR Scanner</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setIsNotificationOpen(true)}
            >
              <BellIcon className="h-10 w-10" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>

            <NotificationDrawer
              open={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-blue-500">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <img
                        alt=""
                        src={
                          user?.profileImage ||
                          "https://media.istockphoto.com/id/1327592449/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=yqoos7g9jmufJhfkbQsk-mdhKEsih6Di4WZ66t_ib7I="
                        }
                        className="size-10 rounded-full object-cover"
                      />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mr-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          <img
                            alt=""
                            src={
                              user?.profileImage ||
                              "https://media.istockphoto.com/id/1327592449/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=yqoos7g9jmufJhfkbQsk-mdhKEsih6Di4WZ66t_ib7I="
                            }
                            className="size-10 rounded-full object-cover"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold leading-none text-foreground">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1.5">
                          {user?.schoolId}
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
