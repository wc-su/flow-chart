import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./index.scss";
import { auth } from "../../components/User/firebase";
import { UserUpdate } from "../../components/Context/UserProvider";

const Home = () => {
  const setUserAction = useContext(UserUpdate);
  // console.log("Home:", setUserAction);

  function linkToChart(e) {
    // console.log("link to chart");
    if (auth.currentUser) {
    } else {
      e.preventDefault();
      setUserAction("login");
    }
  }

  return (
    <div className="Home">
      <div className="main">
        <div className="banner">
          <div className="title"></div>
          <Link to="/Chart" className="link" onClick={linkToChart}>
            Try it free
          </Link>
        </div>
        <div className="intro">
          <ul className="list">
            {/* <li>畫出圖形</li>
            <li>拖移</li> */}
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
