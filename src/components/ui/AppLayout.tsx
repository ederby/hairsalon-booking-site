import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { Toaster } from "./toaster";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full gap-4">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
