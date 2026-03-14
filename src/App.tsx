import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import Rides from "./pages/Rides";
import Rent from "./pages/Rent";
import Errands from "./pages/Errands";
import Volunteering from "./pages/Volunteering";
import Collaboration from "./pages/Collaboration";
import Academic from "./pages/Academic";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/rides" element={<ProtectedRoute><Rides /></ProtectedRoute>} />
            <Route path="/rent" element={<ProtectedRoute><Rent /></ProtectedRoute>} />
            <Route path="/errands" element={<ProtectedRoute><Errands /></ProtectedRoute>} />
            <Route path="/volunteering" element={<ProtectedRoute><Volunteering /></ProtectedRoute>} />
            <Route path="/collaboration" element={<ProtectedRoute><Collaboration /></ProtectedRoute>} />
            <Route path="/academic" element={<ProtectedRoute><Academic /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
