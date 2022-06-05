import React, { useState } from "react";

import "./index.scss";

import { loginUseGoogle, loginUseEmail } from "../firebase";

const Login = ({ setUserAction }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function loginByGoogle() {
    const result = await loginUseGoogle();
    console.log("result:", result);
    if (result.result) {
      setUserAction("");
    }
  }
  async function loginByEmail() {
    const result = await loginUseEmail(email, password);
    console.log("result:", result);
    if (result.result) {
      setUserAction("");
    }
  }

  return (
    <div className="Login">
      <input
        className="Login__google"
        type="button"
        value="Continue with Google"
        onClick={loginByGoogle}
      />
      <p className="Login__info">or</p>
      <input
        className="user__email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      ></input>
      <input
        className="Login__password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <input
        className="Login__submit"
        type="submit"
        value="Log in"
        onClick={loginByEmail}
      />
      <a className="Login__link" onClick={() => setUserAction("forgotPwd")}>
        Forgot password?
      </a>
      <p className="Login__info">
        No account?{" "}
        <a className="Login__link" onClick={() => setUserAction("signup")}>
          create one
        </a>
      </p>
    </div>
  );
};

export default Login;
