import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SimpleNavbar from "./components/SimpleNavbar";
import BottomNavigation from "./components/BottomNavigation";
import Footer from "./components/Footer";
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
import FilterTest from "./pages/FilterTest";
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
              <Route path="/filter-test" element={<FilterTest />} />
            </Routes>
          </AnimatePresence>
        </main>

        <ConditionalFooter />
      </div>
    </Router>
  );
}

export default App;
