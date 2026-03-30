import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "./pages/Index";

// Lazy-loaded routes
const AdminAuthGuard = lazy(() => import("@/components/AdminAuthGuard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));
const CommunityGardensPage = lazy(() => import("./pages/CommunityGardensPage"));
const SupportedGardeningPage = lazy(() => import("./pages/SupportedGardeningPage"));
const FarmsPage = lazy(() => import("./pages/FarmsPage"));
const WildlifeGardeningPage = lazy(() => import("./pages/WildlifeGardeningPage"));
const SurplusProjectsPage = lazy(() => import("./pages/SurplusProjectsPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventTagPage = lazy(() => import("./pages/EventTagPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const EquipmentPage = lazy(() => import("./pages/EquipmentPage"));
const GrantsPage = lazy(() => import("./pages/GrantsPage"));
const PlotsPage = lazy(() => import("./pages/PlotsPage"));
const GrowersNetworkPage = lazy(() => import("./pages/GrowersNetworkPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const LocationDetailPage = lazy(() => import("./pages/LocationDetailPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminEventsPage = lazy(() => import("./pages/AdminEventsPage"));
const AdminCommunityGardensPage = lazy(() => import("./pages/AdminCommunityGardensPage"));
const AdminSupportedGardeningPage = lazy(() => import("./pages/AdminSupportedGardeningPage"));
const AdminWildlifeGardeningPage = lazy(() => import("./pages/AdminWildlifeGardeningPage"));
const AdminFarmsPage = lazy(() => import("./pages/AdminFarmsPage"));
const AdminSurplusProjectsPage = lazy(() => import("./pages/AdminSurplusProjectsPage"));
const AdminCoursesPage = lazy(() => import("./pages/AdminCoursesPage"));
const AdminResourcesPage = lazy(() => import("./pages/AdminResourcesPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const AdminContactsPage = lazy(() => import("./pages/AdminContactsPage"));
const AdminSettingsPage = lazy(() => import("./pages/AdminSettingsPage"));

const queryClient = new QueryClient();

const App = () => (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
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
              <Route path="/resources" element={<ResourcesPage />} />
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
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Admin routes (guarded, with AdminLayout) */}
            <Route path="/admin" element={
              <AdminAuthGuard>
                <AdminLayout />
              </AdminAuthGuard>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="community-gardens" element={<AdminCommunityGardensPage />} />
              <Route path="supported-gardening" element={<AdminSupportedGardeningPage />} />
              <Route path="wildlife-gardening" element={<AdminWildlifeGardeningPage />} />
              <Route path="farms" element={<AdminFarmsPage />} />
              <Route path="surplus-projects" element={<AdminSurplusProjectsPage />} />
              <Route path="courses" element={<AdminCoursesPage />} />
              <Route path="resources" element={<AdminResourcesPage />} />
              <Route path="contacts" element={<AdminContactsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
);

export default App;