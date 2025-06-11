import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Ecommerce from "./pages/Ecommerce";
import SentenceAnalyze from "./pages/SentenceAnalyze";
import Home from "./pages/Home";
import SentiviewAI from "./pages/SentiviewAI";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sentiview-ai" element={<SentiviewAI />} />
        <Route path="/sentiview-ecommerce" element={<Ecommerce />} />
      </Routes>
    </Router>
  );
}

export default App;
