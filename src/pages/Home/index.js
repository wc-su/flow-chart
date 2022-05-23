import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";

const Home = () => {
  return (
    <div className="Home">
      <div className="main">
        <div className="banner">
          <div className="title"></div>
          <Link to="/Chart" className="link">
            Try it free
          </Link>
        </div>
        <div className="intro">
          <ul className="list">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="detail"></div>
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default Home;
