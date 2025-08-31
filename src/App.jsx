import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SimpleNavbar from "./components/SimpleNavbar";
import BottomNavigation from "./components/BottomNavigation";
import Footer from "./components/Footer";
import DisclaimerAgreement from "./components/DisclaimerAgreement";
import Home from "./pages/Home";
import Create from "./pages/Create";
import CreatePoll from "./pages/CreatePoll";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import BuyMeACoffee from "./pages/BuyMeACoffee";
import Admin from "./pages/Admin";

import "./App.css";

// Component to conditionally render navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  if (isAdminPage) {
    return null; // Don't render navbar on admin page
  }

  return <SimpleNavbar />;
};

// Component to conditionally render footer and bottom navigation
const ConditionalFooter = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  if (isAdminPage) {
    return null; // Don't render footer/bottom nav on admin page
  }

  return (
    <>
      <Footer />
      <BottomNavigation />
    </>
  );
};

function App() {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has already agreed to disclaimer
  useEffect(() => {
    const disclaimerAgreed = localStorage.getItem("disclaimerAgreed");
    if (disclaimerAgreed === "true") {
      setHasAgreed(true);
    }
    setIsLoading(false);
  }, []);

  const handleAgree = () => {
    setHasAgreed(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-800 text-lg font-['Comic_Sans_MS']">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Show disclaimer agreement if user hasn't agreed yet
  if (!hasAgreed) {
    return <DisclaimerAgreement onAgree={handleAgree} />;
  }

  // Show main app after agreement
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <ConditionalNavbar />

        <main className="pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/create-poll" element={<CreatePoll />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route
                path="/community-guidelines"
                element={<CommunityGuidelines />}
              />
              <Route path="/buy-me-a-coffee" element={<BuyMeACoffee />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </main>

        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;
