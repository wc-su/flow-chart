import React, { useEffect, useState } from "react";

const UserContext = React.createContext();
const UserUpdate = React.createContext();

const UserProvider = ({ children }) => {
  const [userAction, setUserAction] = useState("");

  // function changeUserAction(action) {
  //   setUserAction(action);
  // }
  useEffect(() => {
    console.log("userAction:", userAction);
  }, [userAction]);

  return (
    <UserContext.Provider value={userAction}>
      <UserUpdate.Provider value={setUserAction}>
        {children}
      </UserUpdate.Provider>
    </UserContext.Provider>
  );
};

export default UserProvider;
export { UserContext, UserUpdate };
