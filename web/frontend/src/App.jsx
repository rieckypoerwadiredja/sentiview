import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ecommerce from "./pages/Ecommerce";
import SentenceAnalyze from "./pages/SentenceAnalyze";
import Home from "./pages/Home";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sentence" element={<SentenceAnalyze />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
      </Routes>
    </Router>
  );
}

export default App;
