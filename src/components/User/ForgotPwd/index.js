import React from "react";
import { Link } from "react-router-dom";

import "./index.scss";

const ForgotPwd = ({ setUserAction }) => {
  return (
    <div className="ForgotPwd">
      <p>Enter your email to reset password</p>
      <input type="email" placeholder="Email" />
      <input
        className="ForgotPwd__submit"
        type="submit"
        value="Reset password"
      />
      <a className="ForgotPwd__link" onClick={() => setUserAction("login")}>
        Cancel
      </a>
    </div>
  );
};

export default ForgotPwd;
