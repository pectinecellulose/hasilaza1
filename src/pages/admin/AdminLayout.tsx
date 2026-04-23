import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

const AdminLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-muted/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30 px-5">
          <SidebarTrigger />
          <h1 className="ml-4 font-display font-bold text-lg">Administration</h1>
        </header>
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AdminLayout;
