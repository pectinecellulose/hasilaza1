import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/produits" element={<ComingSoon title="Catalogue Produits" description="La page produits arrive très bientôt avec toutes nos motos, tricycles et pièces détachées." />} />
            <Route path="/produits/:slug" element={<ComingSoon title="Détail produit" />} />
            <Route path="/depannage" element={<ComingSoon title="Service Dépannage" />} />
            <Route path="/a-propos" element={<ComingSoon title="À propos de Hasilaza Motor" />} />
            <Route path="/contact" element={<ComingSoon title="Contactez-nous" />} />
            <Route path="/mentions-legales" element={<ComingSoon title="Mentions Légales" />} />
            <Route path="/politique-confidentialite" element={<ComingSoon title="Politique de Confidentialité" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
