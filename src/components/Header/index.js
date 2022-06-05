import React, { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";

import "./index.scss";
import icon from "./images/organization-chart-64.png";
import icon2 from "./images/flow-chart-64.png";
import icon3 from "./images/flow-chart-32.png";
import icon4 from "./images/scheme-64.png";
import icon5 from "./images/scheme-32.png";
import User from "../User";
import { auth, logout as fLogout, onAuthStateChanged } from "../User/firebase";
// import UserProvider from "../Context/UserProvider.js";
import { UserContext, UserUpdate } from "../Context/UserProvider.js";

const Header = () => {
  const startFlag = useRef(true);
  const [userLogin, setUserLogin] = useState(false);
  // const [userAction, setUserAction] = useState("");

  const userAction = useContext(UserContext);
  const setUserAction = useContext(UserUpdate);
  // console.log("Header:", userAction, ",", setUserAction);

  useEffect(() => {
    if (startFlag.current) {
      startFlag.current = false;
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserLogin(true);
        } else {
          setUserLogin(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    // console.log("effect: auth: ", userAction, auth.currentUser);
  }, [userAction]);

  function clickMenu(e) {
    if (e.target.nodeName === "A") {
      console.log("xxxx", auth);
      e.preventDefault();
      const action = e.target.getAttribute("data-action");
      setUserAction(e.target.getAttribute("data-action"));
      if (action === "logout") {
        logout();
      }
    }
  }

  async function logout() {
    // await fLogout();
    const result = await fLogout();
    console.log(result);
    console.log("yyyy", auth.currentUser, auth);
    if (result.result) {
      setUserAction("");
    }
  }

  let menuItems;
  // console.log("auth is null:", auth.currentUser === null);
  // console.log("userLogin flag = ", userLogin.current);
  // console.log("userLogin =", userLogin);
  if (userLogin) {
    menuItems = (
      <>
        {/* <li>
          <a className="member" href="#" data-action="member">
            T
          </a>
        </li> */}
        <li>
          <a href="#" data-action="logout">
            Log Out
          </a>
        </li>
      </>
    );
  } else {
    menuItems = (
      <>
        <li>
          <a href="#" data-action="login">
            Log In
          </a>
        </li>
        <li>
          <a className="signup" href="#" data-action="signup">
            Sign Up
          </a>
        </li>
      </>
    );
  }

  return (
    <div className="Header">
      <div className="Header__container">
        <Link to="/" className="Header__logo">
          <img src={icon5} alt="logo" />
          <h1>Flow Chart</h1>
        </Link>
        <ul className="Header__menu" onClick={clickMenu}>
          {menuItems}
        </ul>
      </div>
      {!auth.currentUser && userAction && (
        <User userAction={userAction} setUserAction={setUserAction} />
      )}
    </div>
  );
};

export default Header;
