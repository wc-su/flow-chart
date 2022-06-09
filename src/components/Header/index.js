import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";

import "./index.scss";
import User from "../User";
import { logout as fLogout } from "../../firebase/auth";

import {
  userActionContext,
  UserLoginContext,
} from "../Context/UserProvider.js";
import { LoadingContext } from "../Context/LoadingProvider";

const Header = () => {
  // console.log("header```````");
  // // 第一次執行
  // const startFlag = useRef(true);
  // 使用者是否登陸
  // const [userLogin, setUserLogin] = useState(false);

  const { userAction, setUserAction } = useContext(userActionContext);
  const { userLogin, setUserLogin } = useContext(UserLoginContext);
  const { message, setMessage } = useContext(LoadingContext);

  const location = useLocation();
  const navigate = useNavigate();

  const logoClass = classNames("Header__logo", {
    "Header--isIndex": location.pathname === "/",
  });

  function clickMenu(e) {
    if (e.target.nodeName === "A") {
      // console.log("xxxx", auth);
      e.preventDefault();
      const action = e.target.getAttribute("data-action");
      setUserAction(action);
      if (action === "logout") {
        setMessage("登出中，請稍候...");
        logout();
        if (location.pathname === "/Chart") {
          navigate("/");
        }
        setMessage("");
      }
    }
  }

  async function logout() {
    const result = await fLogout();
    console.log(result);
    // console.log("yyyy", auth.currentUser, auth);
    if (result.result) {
      setUserAction("");
    }
  }

  let menuItems = userLogin ? (
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
  );

  return (
    <div className="Header">
      <div className="Header__container">
        <Link to="/" className={logoClass}>
          {/* <img src={icon4} alt="logo" /> */}
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
