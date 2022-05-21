import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";

const Home = () => {
  return (
    <div className="Home">
      <div className="main">
        <div>
          <div></div>
          <Link to="/Chart">Try it free</Link>
        </div>
        <div>
          <ul>
            <li></li>
            <li></li>
          </ul>
          <div></div>
        </div>
      </div>
      <div className="footer">footer</div>
    </div>
  );
};

export default Home;
