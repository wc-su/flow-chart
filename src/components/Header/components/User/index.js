import React, { useRef, useEffect, useState } from "react";

import "./index.scss";
import Signup from "../Signup";
import Login from "../Login";
import ForgotPwd from "../ForgotPwd";

const User = ({ userAction, setUserAction }) => {
  const clickAction = useRef(false);

  const [errMsg, setErrMsg] = useState("");

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
