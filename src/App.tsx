import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";
import CommunityGardensPage from "./pages/CommunityGardensPage";
import SupportedGardeningPage from "./pages/SupportedGardeningPage";
import FarmsPage from "./pages/FarmsPage";
import WildlifeGardeningPage from "./pages/WildlifeGardeningPage";
import SurplusProjectsPage from "./pages/SurplusProjectsPage";
import CoursesPage from "./pages/CoursesPage";
import EventsPage from "./pages/EventsPage";
import EventTagPage from "./pages/EventTagPage";
import EventDetailPage from "./pages/EventDetailPage";
import ContactPage from "./pages/ContactPage";
import EquipmentPage from "./pages/EquipmentPage";
import GrantsPage from "./pages/GrantsPage";
import PlotsPage from "./pages/PlotsPage";
import GrowersNetworkPage from "./pages/GrowersNetworkPage";
import CalendarPage from "./pages/CalendarPage";
import LocationDetailPage from "./pages/LocationDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/community-gardens" element={<CommunityGardensPage />} />
            <Route path="/supported-gardening" element={<SupportedGardeningPage />} />
            <Route path="/farms" element={<FarmsPage />} />
            <Route path="/wildlife-gardening" element={<WildlifeGardeningPage />} />
            <Route path="/surplus-projects" element={<SurplusProjectsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/resources" element={<PlaceholderPage title="Resources" />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/tags/:tag" element={<EventTagPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/equipment-to-borrow" element={<EquipmentPage />} />
            <Route path="/grants" element={<GrantsPage />} />
            <Route path="/plots-and-land" element={<PlotsPage />} />
            <Route path="/growers-network" element={<GrowersNetworkPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/locations/:slug" element={<LocationDetailPage />} />
            <Route path="/about/growers-network" element={<GrowersNetworkPage />} />
            <Route path="/about/growers-network-convention" element={<PlaceholderPage title="Growers Network Convention" subtitle="Bath Area Growers holds an annual convention bringing together all network members. Details of upcoming conventions will be posted here." />} />
            <Route path="/blog" element={<PlaceholderPage title="Blog" subtitle="News and updates from Bath Area Growers will appear here." />} />
            <Route path="/wildlife-gardening-old" element={<Navigate to="/wildlife-gardening" replace />} />
          </Route>

          {/* Admin login (public, no Layout) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin routes (guarded, no Layout) */}
          <Route path="/admin/*" element={
            <AdminAuthGuard>
              <PlaceholderPage title="Admin Dashboard" subtitle="Admin panel coming soon." />
            </AdminAuthGuard>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
