import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
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
import ContactPage from "./pages/ContactPage";
import EquipmentPage from "./pages/EquipmentPage";
import GrantsPage from "./pages/GrantsPage";
import PlotsPage from "./pages/PlotsPage";
import GrowersNetworkPage from "./pages/GrowersNetworkPage";
import CalendarPage from "./pages/CalendarPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/equipment-to-borrow" element={<EquipmentPage />} />
            <Route path="/grants" element={<GrantsPage />} />
            <Route path="/plots-and-land" element={<PlotsPage />} />
            <Route path="/growers-network" element={<GrowersNetworkPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/events/:slug" element={<PlaceholderPage title="Event Detail" />} />
            <Route path="/locations/:slug" element={<PlaceholderPage title="Location Detail" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
