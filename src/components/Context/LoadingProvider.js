import React, { useState } from "react";

const LoadingContext = React.createContext();

const LoadingProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  return (
    <LoadingContext.Provider
      value={{
        message: message,
        setMessage: setMessage,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
export { LoadingContext };
