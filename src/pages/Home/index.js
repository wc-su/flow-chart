import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./index.scss";
import { auth } from "../../firebase/auth";
import { userActionContext } from "../../components/Context/UserProvider";
import header1 from "./images/header-1.png";
import header2 from "./images/header-2.png";
import header3 from "./images/header-3.png";

const Home = () => {
  const { setUserAction } = useContext(userActionContext);

  function linkToChart(e) {
    // if (!auth.currentUser) {
    //   e.preventDefault();
    //   setUserAction("login");
    // }
  }

  return (
    <div className="Home">
      <div className="main">
        <div className="header">
          <div className="header__container">
            <div className="header__img">
              <img src={header1}></img>
            </div>
            <div className="header__content">
              <div className="header__title">
                <p>Draw a Flowchart</p>
              </div>
              <div className="header__link">
                <Link to="/Chart" className="link" onClick={linkToChart}>
                  Try it free
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="intro">
          {/* <ul className="list">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="detail"></div> */}
        </div>
      </div>
      {/* <div className="footer"></div> */}
    </div>
  );
};

export default Home;
