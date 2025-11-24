import {
  Home,
  Plus,
  Users,
  FileSearch, // Used for Knowledge Base/Research Hub
  Settings,
  MessageSquare, // Used for Campaigns
  CheckSquare, // Used for Tasks
  Inbox,
  ListOrdered, // Used for Sequence
  ChevronLast, // Used for expand arrow
  ChevronFirst,
  SquareLibrary, // Used for collapse arrow
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Calendar, Zap, TrendingUp } from "lucide-react";
import inLogo from "../../public/in.png";
import infyndLogo from "../../public/infynd.svg";
const mainItems = [
  { title: "New Campaign", url: "/campaign/new", icon: Plus },
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Contacts", url: "/contacts", icon: Users },
];

const engageItems = [
  { title: "Campaigns", url: "/campaigns", icon: MessageSquare },
  { title: "Sequences", url: "/sequences", icon: ListOrdered },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Inbox", url: "/inbox", icon: Inbox },
];

const resourceItems = [
  { title: "Research Hub", url: "/research", icon: FileSearch },
  { title: "Knowledge Base", url: "/knowledge", icon: SquareLibrary },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const LogoIcon = <img src={inLogo} alt="IN" className="h-10 w-auto" />;
  const LogoText = (
    <img src={infyndLogo} alt="Infynd" className="h-10 w-auto" />
  );

  return (
    <Sidebar
      className={`${
        open ? "w-60" : "w-14"
      } transition-width duration-300 ease-in-out max-h-screen sticky top-0 flex flex-col bg-sidebar border-r border-divider shadow-sm overflow-y-auto`}
      collapsible="icon"
    >
      <div className="flex items-center p-2 sticky top-0 bg-sidebar z-10">
        {open ? (
          <>
            <div className="flex items-center gap-2 overflow-hidden w-auto opacity-100 transition-all duration-300 ease-in-out">
              {LogoText}
            </div>
            <Button
              onClick={toggleSidebar}
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 hover:bg-sidebar-accent text-text-primary ml-auto"
              aria-label="Collapse sidebar"
            >
              <ChevronFirst className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <div
            className="flex items-center justify-center w-full h-8 cursor-pointer group rounded-md hover:bg-sidebar-accent transition-colors relative"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
          >
            <div className="absolute transition-opacity duration-150 group-hover:opacity-0 opacity-100">
              {LogoIcon}
            </div>

            <div className="absolute transition-opacity duration-150 group-hover:opacity-100 opacity-0">
              <ChevronLast className="h-6 w-6 text-text-primary" />
            </div>

            {/* Tooltip for better UX when collapsed */}
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 rounded-md bg-tooltip-bg px-2 py-1 text-xs text-tooltip-text opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap shadow-lg">
              Expand sidebar
            </span>
          </div>
        )}
      </div>

      <SidebarSeparator className="bg-divider my-0" />

      <SidebarContent className="bg-sidebar flex flex-col flex-grow pt-2">
        {/* Main Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`relative group ${
                    isActive(item.url)
                      ? "bg-primary text-primary-foreground font-semibold"
                      : ""
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-text-primary"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && (
                        <span className="whitespace-nowrap">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                  {!open && (
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 rounded-md bg-tooltip-bg px-2 py-1 text-xs text-tooltip-text opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                      {item.title}
                    </span>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-divider my-2" />

        {/* Engage Group */}
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-text-secondary pl-4 pb-1 text-sm">
              Engage
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {engageItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`relative group ${
                    isActive(item.url)
                      ? "bg-primary text-primary-foreground font-semibold"
                      : ""
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-text-primary"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && (
                        <span className="whitespace-nowrap">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                  {!open && (
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 rounded-md bg-tooltip-bg px-2 py-1 text-xs text-tooltip-text opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                      {item.title}
                    </span>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-divider my-2" />

        {/* Resources Group (Knowledge Base and Research Hub) */}
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-text-secondary pl-4 pb-1 text-sm">
              Resources
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {resourceItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`relative group ${
                    isActive(item.url)
                      ? "bg-primary text-primary-foreground font-semibold"
                      : ""
                  }`}
                >
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sidebar-accent transition-colors ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-text-primary"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && (
                        <span className="whitespace-nowrap">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                  {!open && (
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 rounded-md bg-tooltip-bg px-2 py-1 text-xs text-tooltip-text opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                      {item.title}
                    </span>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Empty div to push the user profile to the bottom */}
        <div className="mt-auto" />

        {/* User profile section */}
        {user && (
          <>
            <SidebarSeparator className="bg-divider my-2" />
            <SidebarGroup>
              <SidebarGroupContent>
                {/* REVISION: Adjusted padding (px-2 py-2) and width (w-10) for centering the avatar when collapsed (w-14) */}
                <div
                  className={`flex items-center gap-3 px-2 py-2 cursor-pointer group relative hover:bg-sidebar-accent rounded-md ${
                    !open ? "justify-center" : "" // Center content when sidebar is collapsed
                  }`}
                  onClick={() => setProfileOpen(!profileOpen)}
                  onBlur={() => setProfileOpen(false)}
                  tabIndex={0}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {open && (
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="text-sm font-medium truncate">
                        {user.email?.split("@")[0]}
                      </p>
                    </div>
                  )}

                  {open && profileOpen && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-md w-48 z-20 ring-1 ring-black ring-opacity-5">
                      <NavLink
                        to="/settings"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        Settings
                      </NavLink>
                      <NavLink
                        to="/settings/billing"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        Plan & Billing
                      </NavLink>
                      <button
                        onClick={() => {
                          signOut();
                          setProfileOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-rose-600"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
