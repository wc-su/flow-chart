import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "./index.scss";
import icon from "./images/organization-chart-64.png";
import icon2 from "./images/flow-chart-64.png";
import icon3 from "./images/flow-chart-32.png";
import icon4 from "./images/scheme-64.png";
import icon5 from "./images/scheme-32.png";
import User from "../User";
import {
  // auth,
  logout as fLogout,
  // onAuthStateChanged,
} from "../../firebase/auth";
// import UserProvider from "../Context/UserProvider.js";
import {
  userActionContext,
  UserLoginContext,
} from "../Context/UserProvider.js";

const Header = () => {
  // console.log("header```````");
  // // 第一次執行
  // const startFlag = useRef(true);
  // 使用者是否登陸
  // const [userLogin, setUserLogin] = useState(false);

  const { userAction, setUserAction } = useContext(userActionContext);
  const { userLogin, setUserLogin } = useContext(UserLoginContext);

  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("<<< Header >>>", auth.currentUser);
  //   if (startFlag.current) {
  //     startFlag.current = false;
  //     console.log("lllll");
  //     onAuthStateChanged(auth, (user) => {
  //       console.log("ppppp");
  //       if (user) {
  //         setUserLogin(true);
  //         console.log("sssss");
  //       } else {
  //         setUserLogin(false);
  //       }
  //     });
  //   }
  // }, []);

  function clickMenu(e) {
    if (e.target.nodeName === "A") {
      // console.log("xxxx", auth);
      e.preventDefault();
      const action = e.target.getAttribute("data-action");
      setUserAction(action);
      if (action === "logout") {
        logout();
        console.log(location.pathname);
        if (location.pathname === "/Chart") {
          navigate("/");
        }
      }
    }
  }

  async function logout() {
    // await fLogout();
    const result = await fLogout();
    console.log(result);
    // console.log("yyyy", auth.currentUser, auth);
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
      {!userLogin && userAction && (
        <User userAction={userAction} setUserAction={setUserAction} />
      )}
    </div>
  );
};

export default Header;
