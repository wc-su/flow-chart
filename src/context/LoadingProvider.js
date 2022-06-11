import React, { useState } from "react";

import "./LoadingProvider.scss";

const LoadingContext = React.createContext();

const LoadingProvider = ({ children }) => {
  const [message, setMessage] = useState("");

  const show = message ? true : false;

  return (
    <LoadingContext.Provider
      value={{
        message: message,
        setMessage: setMessage,
      }}
    >
      {children}
      {show ? (
        <div className="Loading">
          <div className="Loading__container">
            <span className="Loading__message">{message}</span>
            <div className="Loading__effect">
              <ul className="Loading__spinner">
                <li className="Loading__bubble-1"></li>
                <li className="Loading__bubble-2"></li>
                <li className="Loading__bubble-3"></li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
export { LoadingContext };
