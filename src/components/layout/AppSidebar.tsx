import {
  CalendarDays,
  LayoutDashboard,
  NotebookText,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const links = [
  {
    title: "Skrivbord",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Kalender",
    url: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Tjänster",
    url: "/services",
    icon: NotebookText,
  },
  {
    title: "Inställningar",
    url: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>NAMN PÅ FÖRETAG</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === link.url}
                  >
                    <Link to={link.url}>
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
