import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SimpleNavbar from "./components/SimpleNavbar";
import BottomNavigation from "./components/BottomNavigation";
import Footer from "./components/Footer";
import AdSense from "./components/AdSense";
import NotificationPrompt from "./components/NotificationPrompt";
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
import NotificationSettings from "./pages/NotificationSettings";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <SimpleNavbar />

        {/* Notification Permission Prompt */}
        <NotificationPrompt />

        {/* Top Banner Ad */}
        <div className="w-full bg-white border-b border-gray-200">
          <AdSense
            adSlot="1234567890"
            adFormat="auto"
            className="w-full"
            style={{ minHeight: "90px" }}
          />
        </div>

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
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Bottom Banner Ad */}
        <div className="w-full bg-white border-t border-gray-200">
          <AdSense
            adSlot="0987654321"
            adFormat="auto"
            className="w-full"
            style={{ minHeight: "90px" }}
          />
        </div>

        <Footer />
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
