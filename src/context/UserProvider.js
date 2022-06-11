import React, { useState, useRef, useEffect } from "react";

import { auth, onAuthStateChanged } from "../firebase/auth";

const userActionContext = React.createContext();
const UserLoginContext = React.createContext();

const UserProvider = ({ children }) => {
  // 第一次執行
  const startFlag = useRef(true);
  const outerRef = useRef();

  const [userAction, setUserAction] = useState("");
  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    // console.log("<<< Header >>>", auth.currentUser);
    if (startFlag.current) {
      startFlag.current = false;
      // console.log("lllll");
      onAuthStateChanged(auth, (user) => {
        // console.log("ppppp");
        if (user) {
          setUserLogin(true);
          // console.log("sssss");
        } else {
          setUserLogin(false);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (userAction) {
      stopScroll(true);
    } else {
      stopScroll(false);
    }
  }, [userAction]);

  function stopScroll(stopFlag) {
    if (stopFlag) {
      outerRef.current.classList.add("outer");
    } else {
      outerRef.current.classList.remove("outer");
    }
  }

  return (
    <userActionContext.Provider
      value={{ userAction: userAction, setUserAction: setUserAction }}
    >
      <UserLoginContext.Provider
        value={{ userLogin: userLogin, setUserLogin: setUserLogin }}
      >
        <div ref={outerRef}>{children}</div>
      </UserLoginContext.Provider>
    </userActionContext.Provider>
  );
};

export default UserProvider;
export { userActionContext, UserLoginContext };
