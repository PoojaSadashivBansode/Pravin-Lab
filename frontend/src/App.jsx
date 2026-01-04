import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chatbot from "./components/ChatBot";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FBFBFB] font-sans">
        <Navbar />
        <main className="flex-grow pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;