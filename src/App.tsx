import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

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
            <Route path="/community-gardens" element={<PlaceholderPage title="Community Gardens" />} />
            <Route path="/supported-gardening" element={<PlaceholderPage title="Supported Gardening" />} />
            <Route path="/farms" element={<PlaceholderPage title="Farms" />} />
            <Route path="/wildlife-gardening" element={<PlaceholderPage title="Wildlife Gardening" />} />
            <Route path="/surplus-projects" element={<PlaceholderPage title="Surplus Projects" />} />
            <Route path="/courses" element={<PlaceholderPage title="Courses" />} />
            <Route path="/resources" element={<PlaceholderPage title="Resources" />} />
            <Route path="/events" element={<PlaceholderPage title="Events" />} />
            <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
            <Route path="/equipment-to-borrow" element={<PlaceholderPage title="Equipment to Borrow" />} />
            <Route path="/grants" element={<PlaceholderPage title="Grants" />} />
            <Route path="/plots-and-land" element={<PlaceholderPage title="Plots and Land" />} />
            <Route path="/growers-network" element={<PlaceholderPage title="Growers Network" />} />
            <Route path="/calendar" element={<PlaceholderPage title="Calendar" />} />
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
