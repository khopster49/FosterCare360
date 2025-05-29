import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Landing } from "@/pages/Landing";
import { Home } from "@/pages/Home";
import ApplicationForm from "@/pages/ApplicationForm";
import SimpleApplicationForm from "@/pages/SimpleApplicationForm";
import ApplicationFormComplete from "@/pages/ApplicationFormComplete";
import WorkingApplicationForm from "@/pages/WorkingApplicationForm";
import TestApp from "@/pages/TestApp";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="*" component={() => <Auth onAuthSuccess={() => window.location.reload()} />} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/application" component={WorkingApplicationForm} />
          <Route path="/application/:step" component={WorkingApplicationForm} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
