import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import OrderSummary from "./pages/OrderSummary";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetails from "./pages/OrderDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("🚀 [APP] Application initializing...");
  console.log("📦 [APP] React version:", React.version);

  // Runtime verification for Supabase environment variables
  console.log("🔧 [ENV] Supabase Configuration Check:");
  console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
  console.log("Supabase Key Loaded:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log("EmailJS Service ID:", import.meta.env.VITE_EMAILJS_SERVICE_ID ? "✓ Set" : "✗ Missing");

  // Error handling for missing Supabase variables
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error("❌ [ENV] CRITICAL: Supabase environment variables are missing!");
    console.error("❌ [ENV] Please add the following to your .env file:");
    console.error("   VITE_SUPABASE_URL=https://your-project.supabase.co");
    console.error("   VITE_SUPABASE_ANON_KEY=your-anon-key-here");
    console.error("❌ [ENV] Then restart the dev server: npm run dev");
  } else {
    console.log("✅ [ENV] Supabase configuration loaded successfully");
  }

  console.log("✅ [APP] Providers initialized: QueryClient, Tooltip, Router, Auth, Cart");
  console.log("✅ [APP] Routes configured: /, /checkout, /order-summary, /order-success");
  console.log("🎯 [APP] Application ready to render");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-summary" element={<OrderSummary />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
