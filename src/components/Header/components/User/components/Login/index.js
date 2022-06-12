import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./index.scss";

import { authUseGoogle, loginUseEmail } from "../../../../../../firebase/auth";
import { LoadingContext } from "../../../../../../context/LoadingProvider";

const Login = ({ userAction, setUserAction, changeErrMsg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { message, setMessage } = useContext(LoadingContext);

  const navigate = useNavigate();

  useEffect(() => {
    // 測試帳號
    setEmail("demo@test.com");
    setPassword("123456");
  }, []);

  useEffect(() => {
    console.log("Login: useEffect userAction:", userAction);
    if (!userAction) {
    }
  }, [userAction]);

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function loginByGoogle() {
    setMessage("請操作跳出視窗進行登入");
    const result = await authUseGoogle();
    console.log("result:", result);
    if (result.result) {
      setUserAction("");
      navigate("/Files");
    }
    changeErrMsg(result.message);
    setMessage("");
  }
  async function loginByEmail() {
    setMessage("登入中，請稍候...");
    const result = await loginUseEmail(email, password);
    console.log("result:", result);
    if (result.result) {
      setUserAction("");
      navigate("/Files");
    }
    changeErrMsg(result.message);
    setMessage("");
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
