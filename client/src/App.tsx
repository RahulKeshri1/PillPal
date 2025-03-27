import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Medications from "@/pages/Medications";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import { MedicationProvider } from "./contexts/MedicationContext";
import PrivateRoute from "./components/PrivateRoute";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      )} />
      <Route path="/medications" component={() => (
        <PrivateRoute>
          <Medications />
        </PrivateRoute>
      )} />
      <Route path="/history" component={() => (
        <PrivateRoute>
          <History />
        </PrivateRoute>
      )} />
      <Route path="/settings" component={() => (
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MedicationProvider>
          <Router />
          <Toaster />
        </MedicationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
