import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import NewListingPage from "@/pages/new-listing";
import ListingsPage from "@/pages/listings";
import AccountPage from "@/pages/account";
import NotFoundPage from "@/pages/not-found";

// Protected route wrapper
import { ProtectedRoute } from "@/components/protected-route";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="fairlist-theme">
        <AuthProvider>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <ProtectedRoute path="/new-listing" component={NewListingPage} />
            <ProtectedRoute path="/listings" component={ListingsPage} />
            <ProtectedRoute path="/account" component={AccountPage} />
            <Route component={NotFoundPage} />
          </Switch>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}