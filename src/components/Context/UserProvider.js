import React, { useState, useRef, useEffect } from "react";

import { auth, onAuthStateChanged } from "../../firebase/auth";

const userActionContext = React.createContext();
const UserLoginContext = React.createContext();

const UserProvider = ({ children }) => {
  // 第一次執行
  const startFlag = useRef(true);

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

  return (
    <userActionContext.Provider
      value={{ userAction: userAction, setUserAction: setUserAction }}
    >
      <UserLoginContext.Provider
        value={{ userLogin: userLogin, setUserLogin: setUserLogin }}
      >
        {children}
      </UserLoginContext.Provider>
    </userActionContext.Provider>
  );
};

export default UserProvider;
export { userActionContext, UserLoginContext };
