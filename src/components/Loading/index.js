import React, { useContext } from "react";

import "./index.scss";
import { LoadingContext } from "../Context/LoadingProvider";

const Loading = () => {
  const { message } = useContext(LoadingContext);

  return (
    message && (
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
    )
  );
};

export default Loading;
