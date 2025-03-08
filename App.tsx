import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Home from "./pages/home";
import About from "./pages/about";
import Services from "./pages/services";
import ErpSolutions from "./pages/erp-solutions";
import Contact from "./pages/contact";
import Signup from "./pages/signup";
import Auth from "./pages/auth";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/erp-solutions" component={ErpSolutions} />
          <Route path="/contact" component={Contact} />
          <Route path="/signup" component={Signup} />
          <Route path="/auth" component={Auth} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;