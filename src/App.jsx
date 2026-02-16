import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Workers from "./pages/Workers";
import WorkerDetails from "./pages/WorkerDetails";
import CreateProfile from "./pages/CreateProfile";
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
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/:id" element={<WorkerDetails />} />
          <Route path="/create-profile" element={<CreateProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
