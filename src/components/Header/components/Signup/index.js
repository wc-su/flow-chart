import React, { useState, useContext } from "react";

import "./index.scss";

import { authUseGoogle, SignupUseEmail } from "../../../../firebase/auth";
import { LoadingContext } from "../../../../context/LoadingProvider";

const SignUp = ({ setUserAction, changeErrMsg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { message, setMessage } = useContext(LoadingContext);

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function signUpByGoogle() {
    setMessage("請操作跳出視窗進行註冊");
    const result = await authUseGoogle();
    console.log("result:", result);
    if (result.result) {
      setUserAction("");
    }
    changeErrMsg(result.message);
    setMessage("");
  }

  async function signUpByEmail() {
    const result = await SignupUseEmail(email, password);
    console.log("result:", result);
    if (result.result) {
      setUserAction("");
    }
    changeErrMsg(result.message);
  }

  return (
    <div className="Signup">
      <input
        className="Signup__google"
        type="button"
        value="Continue with Google"
        onClick={signUpByGoogle}
      />
      <p className="Signup__info">or</p>
      <input
        className="user__email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      ></input>
      <input
        className="Signup__password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <input
        className="Signup__submit"
        type="submit"
        value="Create account"
        onClick={signUpByEmail}
      />
      <p className="Signup__info">
        Already have an account?{" "}
        <a className="Signup__link" onClick={() => setUserAction("login")}>
          Log in
        </a>
      </p>
    </div>
  );
};

export default SignUp;
