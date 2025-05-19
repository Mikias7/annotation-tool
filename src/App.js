
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Canvas from './pages/canvas.js';
import Test from './pages/test.js';
import Upload from './pages/upload.js';
import Home from './pages/home.js';
import HelpPage from './pages/help.js';


function App() {
  return (
    <Router>

      {/* <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/Upload">Upload</Link> |{" "}
        <Link to="/canvas">Canvas</Link> |{" "}
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
