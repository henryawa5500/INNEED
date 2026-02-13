import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-shell">
      {/* Global layout wrapper shared across all routes */}
      <Navbar />
      <main>
        {/* Page-level routing */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
