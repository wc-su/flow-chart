import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";
import icon from "./images/organization-chart-64.png";
import icon2 from "./images/flow-chart-64.png";
import icon3 from "./images/flow-chart-32.png";
import icon4 from "./images/scheme-64.png";
import icon5 from "./images/scheme-32.png";

const Header = () => {
  return (
    <div className="Header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={icon5} alt="logo" />
          <h1>Flow Chart</h1>
        </Link>
        <ul className="menu">
          <li>
            <a href="#">Log In</a>
          </li>
          <li>
            <a href="#" className="signup">
              Sign Up
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
