import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Link to="/sentence">sentence</Link>
      <Link to="/ecommerce">ecommerce</Link>
    </div>
  );
}

export default Home;
