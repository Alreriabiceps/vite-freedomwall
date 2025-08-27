import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SimpleNavbar from "./components/SimpleNavbar";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import Create from "./pages/Create";
import CreatePoll from "./pages/CreatePoll";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <SimpleNavbar />
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
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
        </main>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
