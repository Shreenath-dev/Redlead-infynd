import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NewCampaign from "./pages/NewCampaign";
import Campaigns from "./pages/Campaigns";
import Contacts from "./pages/Contacts";
import Research from "./pages/Research";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Inbox from "./pages/Inbox";
import NotFound from "./pages/NotFound";
import CampaignDetails from "./pages/CampaignDetails";
import Knowledge from "./pages/Knowledge";
import SequencePage from "./pages/Sequence";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<NewCampaign />} />
              <Route index path="campaign/new" element={<NewCampaign />} />

              <Route path='dashboard' element={<Dashboard />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route
                path="/campaigns/:id/details"
                element={<CampaignDetails />}
              />
              <Route path="contacts" element={<Contacts />} />
              <Route path="research" element={<Research />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="knowledge" element={<Knowledge />} />
              <Route path="sequence" element={<SequencePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
