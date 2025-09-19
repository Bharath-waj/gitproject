import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Simulation from "./pages/Simulation";
import About from "./pages/About";
import "@fontsource/inter";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              <div className="text-xl">Loading...</div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
