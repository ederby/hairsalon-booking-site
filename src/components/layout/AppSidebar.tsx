import {
  CalendarDays,
  LayoutDashboard,
  LucideProps,
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
import { useQueryClient } from "@tanstack/react-query";
import { getCategories } from "@/services/apiGeneral";
import { useCompanySettings } from "@/features/settings/useCompanySettings";

type LinksType = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  preFetch?: string;
}[];

const links: LinksType = [
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
    preFetch: "categories",
  },
  {
    title: "Inställningar",
    url: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { companySettings, isLoadingCompanySettings } = useCompanySettings();

  function handleOnMouseEnter(preFetch: string | undefined) {
    queryClient.prefetchQuery({
      queryKey: [preFetch],
      queryFn: getCategories,
    });
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isLoadingCompanySettings
              ? "Laddar..."
              : companySettings?.companyName.toUpperCase()}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === link.url}
                  >
                    <Link
                      to={link.url}
                      onMouseEnter={() => handleOnMouseEnter(link.preFetch)}
                    >
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
