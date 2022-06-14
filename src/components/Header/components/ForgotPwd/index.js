import React, { useState } from "react";

import { resetPassword } from "../../../../firebase/auth";

import "./index.scss";

const ForgotPwd = ({ setUserAction, changeErrMsg }) => {
  const [email, setEmail] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  async function sendResetPwdEmail() {
    const result = await resetPassword(email);
    changeErrMsg(result.message);
  }

  return (
    <div className="ForgotPwd">
      <p>Enter your email to reset password</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        className="ForgotPwd__submit"
        type="submit"
        value="Reset password"
        onClick={sendResetPwdEmail}
      />
      <a className="ForgotPwd__link" onClick={() => setUserAction("login")}>
        Cancel
      </a>
    </div>
  );
};

export default ForgotPwd;
