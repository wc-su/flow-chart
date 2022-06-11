import React, { useRef, useEffect, useContext, useState } from "react";

import "./index.scss";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPwd from "./components/ForgotPwd";

// import { userActionContext } from "../../context/UserProvider";
import { userActionContext } from "../../../context/UserProvider";

const User = ({}) => {
  const clickAction = useRef(false);

  const [errMsg, setErrMsg] = useState("");

  const { userAction, setUserAction } = useContext(userActionContext);

  useEffect(() => {
    changeErrMsg("");
  }, [userAction]);

  function handleMouseDown() {
    clickAction.current = true;
  }

  function handleMouseUp() {
    if (clickAction.current) {
      clickAction.current = false;
      setUserAction("");
    }
  }

  function changeErrMsg(msg) {
    setErrMsg(msg);
  }

  return (
    <div
      className="user"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className="container user__container"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="close" onClick={() => setUserAction("")}></div>
        {errMsg && <p className="user__errMsg">{errMsg}</p>}
        {userAction === "login" && (
          <Login
            userAction={userAction}
            setUserAction={setUserAction}
            changeErrMsg={changeErrMsg}
          />
        )}
        {userAction === "signup" && (
          <Signup setUserAction={setUserAction} changeErrMsg={changeErrMsg} />
        )}
        {userAction === "forgotPwd" && (
          <ForgotPwd
            setUserAction={setUserAction}
            changeErrMsg={changeErrMsg}
          />
        )}
      </div>
    </div>
  );
};

export default User;
