import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Bancas from "@/pages/Bancas";
import NovaAposta from "@/pages/NovaAposta";
import Historico from "@/pages/Historico";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Force dark mode
if (!document.documentElement.classList.contains('dark')) {
  document.documentElement.classList.add('dark');
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bancas" element={<Bancas />} />
            <Route path="/apostas/nova" element={<NovaAposta />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
