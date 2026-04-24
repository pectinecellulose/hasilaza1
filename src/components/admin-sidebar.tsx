import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  Users,
  Settings,
  MessageSquare,
  ShieldCheck,
  LogOut,
  Home,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo.png";

const mainItems = [
  { title: "Tableau de bord", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Produits", url: "/admin/produits", icon: Package },
  { title: "Blog", url: "/admin/blog", icon: BookOpen },
  { title: "Commandes", url: "/admin/commandes", icon: ShoppingCart },
  { title: "Factures", url: "/admin/factures", icon: FileText },
  { title: "Statistiques", url: "/admin/statistiques", icon: BarChart3 },
  { title: "Clients", url: "/admin/clients", icon: Users },
];

const systemItems = [
  { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  { title: "Administrateurs", url: "/admin/administrateurs", icon: ShieldCheck },
  { title: "Paramètres", url: "/admin/parametres", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-glow shrink-0 p-1">
            <img src={logo} alt="Hasilaza Motor" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-display font-bold text-sm leading-tight truncate text-sidebar-foreground">
                Hasilaza Admin
              </p>
              <p className="text-[11px] text-sidebar-foreground/60 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/40 px-3 mb-2">
              Gestion
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-xl">
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-gradient-primary text-primary-foreground hover:bg-gradient-primary hover:text-primary-foreground font-semibold shadow-elegant"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/40 px-3 mb-2">
              Système
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-xl">
                    <NavLink
                      to={item.url}
                      className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-gradient-primary text-primary-foreground hover:bg-gradient-primary hover:text-primary-foreground font-semibold shadow-elegant"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 rounded-xl">
              <NavLink
                to="/"
                className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                activeClassName=""
              >
                <Home className="h-4 w-4" />
                {!collapsed && <span className="text-sm">Voir le site</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="h-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="text-sm">Déconnexion</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
