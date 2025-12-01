import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import CriteresPage from "./pages/CriteresPage";
import FAQPage from "./pages/FAQPage";
import CommentCaMarchePage from "./pages/CommentCaMarchePage";
import PartenairesPage from "./pages/PartenairesPage";
import ContactPage from "./pages/ContactPage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import CGUPage from "./pages/CGUPage";
import PolitiqueConfidentialitePage from "./pages/PolitiqueConfidentialitePage";
import PolitiqueCookiesPage from "./pages/PolitiqueCookiesPage";
import CommunautePage from "./pages/CommunautePage";
import EvaluateursPage from "./pages/EvaluateursPage";
import InvestorAnalyticsPage from "./pages/InvestorAnalyticsPage";
import TimelinePage from "./pages/TimelinePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />
            
            {/* Public Pages */}
            <Route path="/communaute" element={<CommunautePage />} />
            <Route path="/evaluateurs" element={<EvaluateursPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/criteres" element={<CriteresPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/comment-ca-marche" element={<CommentCaMarchePage />} />
            <Route path="/partenaires" element={<PartenairesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Protected Pages */}
            <Route path="/investor-analytics" element={
              <ProtectedRoute>
                <InvestorAnalyticsPage />
              </ProtectedRoute>
            } />
            
            {/* Legal Pages */}
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="/cgu" element={<CGUPage />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
            <Route path="/politique-cookies" element={<PolitiqueCookiesPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
