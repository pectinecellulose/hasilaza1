import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

const AdminLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center border-b bg-background px-4">
          <SidebarTrigger />
          <h1 className="ml-3 font-semibold">Administration</h1>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AdminLayout;
