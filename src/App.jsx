import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import AnimatedBackground from "./components/AnimatedBackground";
import Footer from "./components/Footer";
import SimpleNavbar from "./components/SimpleNavbar";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Animated Background - Only show on non-admin pages */}
      {!isAdminPage && <AnimatedBackground />}

      {/* Simple Navigation - Only show on non-admin pages */}
      {!isAdminPage && <SimpleNavbar />}

      {/* Main Content */}
      <main className={isAdminPage ? "min-h-screen" : "pt-20 pb-8 px-4"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Routes>
      </main>

      {/* Footer - Only show on non-admin pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
