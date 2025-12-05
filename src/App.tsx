import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Hospitals from "./pages/Hospitals";
import Forecaster from "./pages/Forecaster";
import Advisories from "./pages/Advisories";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import CivicData from "./pages/CivicData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/hospitals" element={<Layout><Hospitals /></Layout>} />
          <Route path="/forecaster" element={<Layout><Forecaster /></Layout>} />
          <Route path="/advisories" element={<Layout><Advisories /></Layout>} />
          <Route path="/civic-data" element={<Layout><CivicData /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
