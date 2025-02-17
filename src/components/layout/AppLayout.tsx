import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { Toaster } from "../ui/toaster";
import Wrapper from "./Wrapper";

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <Header />
        <Wrapper>
          <Outlet />
        </Wrapper>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
