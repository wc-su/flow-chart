import React, { useState, useRef, useEffect } from "react";

import { auth, onAuthStateChanged } from "../firebase/auth";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [userLogin, setUserLogin] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLogin(1);
      } else {
        setUserLogin(2);
      }
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        userLogin: userLogin,
        setUserLogin: setUserLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export { UserContext };
