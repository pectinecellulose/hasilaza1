import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";
import Index from "./pages/Index.tsx";
import Produits from "./pages/Produits.tsx";
import ProduitDetail from "./pages/ProduitDetail.tsx";
import APropos from "./pages/APropos.tsx";
import Contact from "./pages/Contact.tsx";
import Depannage from "./pages/Depannage.tsx";
import MentionsLegales from "./pages/MentionsLegales.tsx";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite.tsx";
import Auth from "./pages/Auth.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminProductForm from "./pages/admin/AdminProductForm.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminMessages from "./pages/admin/AdminMessages.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import ClientLayout from "./pages/client/ClientLayout.tsx";
import ClientOrders from "./pages/client/ClientOrders.tsx";
import ClientFavorites from "./pages/client/ClientFavorites.tsx";
import ClientRepairs from "./pages/client/ClientRepairs.tsx";
import ClientProfile from "./pages/client/ClientProfile.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/produits" element={<Produits />} />
              <Route path="/produits/:slug" element={<ProduitDetail />} />
              <Route path="/depannage" element={<Depannage />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />

              <Route
                path="/compte"
                element={
                  <ProtectedRoute>
                    <ClientLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ClientOrders />} />
                <Route path="favoris" element={<ClientFavorites />} />
                <Route path="depannage" element={<ClientRepairs />} />
                <Route path="profil" element={<ClientProfile />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="produits" element={<AdminProducts />} />
                <Route path="produits/nouveau" element={<AdminProductForm />} />
                <Route path="produits/:id" element={<AdminProductForm />} />
                <Route path="commandes" element={<AdminOrders />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="administrateurs" element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
