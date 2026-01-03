import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tests from './pages/Tests';
import Packages from './pages/Packages';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from "./components/Footer";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FBFBFB] font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/login" element={<Auth />} /> */}
        </Routes>
        <main />
        {/*<Footer />*/}
      </div>
    </Router>
  );
}

export default App;