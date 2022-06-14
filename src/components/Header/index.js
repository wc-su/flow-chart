import React, { useContext, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { logout as fLogout } from "../../firebase/auth";

import "./index.scss";
import User from "./components/User";
import {
  userActionContext,
  UserLoginContext,
} from "../../context/UserProvider";
import { LoadingContext } from "../../context/LoadingProvider";

import menuIcon from "./images/menu.png";
import closeIcon from "./images/close.png";

const Header = () => {
  const { userAction, setUserAction } = useContext(userActionContext);
  const { userLogin } = useContext(UserLoginContext);
  const { setMessage } = useContext(LoadingContext);

  const menuRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  const logoClass = classNames("Header__logo", {
    "Header--isIndex": location.pathname === "/",
  });

  useEffect(() => {
    if (!userAction) {
      menuRef.current.classList.remove("Header__menu--display");
    }
  }, [userAction]);

  function clickMenu(e) {
    if (e.target.nodeName === "A") {
      e.preventDefault();
      const action = e.target.getAttribute("data-action");
      setUserAction(action);
      if (action === "logout") {
        setMessage("登出中，請稍候...");
        logout();
        // if (location.pathname === "/Chart") {
        //   navigate("/");
        // }
        setMessage("");
      }
    }
  }

  async function logout() {
    const result = await fLogout();
    if (result.result) {
      setUserAction("");
    }
  }

  function handleCloseIconClick() {
    menuRef.current.classList.remove("Header__menu--display");
  }

  function handleOpenIconClick() {
    menuRef.current.classList.add("Header__menu--display");
  }

  return (
    <div className="Header">
      <div className="Header__container">
        <Link to="/" className={logoClass}>
          <h1>
            <span className="logo-pre">F</span>
            <span className="logo-pre">l</span>
            <span className="logo-pre">o</span>
            <span className="logo-pre">w</span>
            <span>C</span>
            <span>h</span>
            <span>a</span>
            <span>r</span>
            <span>t</span>
          </h1>
        </Link>
        <div className="Header__menuIcon" onClick={handleOpenIconClick}>
          <img src={menuIcon} alt="menu icon"></img>
        </div>
        <div className="Header__menu" ref={menuRef}>
          <div
            className="Header__menu-closeIcon"
            onClick={handleCloseIconClick}
          >
            <img src={closeIcon} alt="close icon"></img>
          </div>
          <ul onClick={clickMenu}>
            {userLogin === 1 ? (
              <li>
                <a href="#" data-action="logout">
                  Log Out
                </a>
              </li>
            ) : (
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
            )}
          </ul>
        </div>
      </div>
      {!(userLogin === 1) && userAction && (
        <User userAction={userAction} setUserAction={setUserAction} />
      )}
    </div>
  );
};

export default Header;
