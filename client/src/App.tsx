import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PersonaBuilder from "@/pages/persona-builder";
import CampaignCreator from "@/pages/campaign-creator";
import Dashboard from "@/pages/dashboard";
import ApiSettings from "@/pages/api-settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/persona-builder" component={PersonaBuilder} />
      <Route path="/campaign-creator" component={CampaignCreator} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/api-settings" component={ApiSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;