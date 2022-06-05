import React, { useRef } from "react";

import "./index.scss";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPwd from "./ForgotPwd";

const User = ({ userAction, setUserAction }) => {
  const clickAction = useRef(false);

  function handleMouseDown() {
    clickAction.current = true;
  }

  function handleMouseUp() {
    if (clickAction.current) {
      clickAction.current = false;
      setUserAction("");
    }
  }
  return (
    <div
      className="User"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className="container user__container"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="close" onClick={() => setUserAction("")}></div>
        {userAction === "login" && <Login setUserAction={setUserAction} />}
        {userAction === "signup" && <Signup setUserAction={setUserAction} />}
        {userAction === "forgotPwd" && (
          <ForgotPwd setUserAction={setUserAction} />
        )}
      </div>
    </div>
  );
};

export default User;
