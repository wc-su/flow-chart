import React, { useContext } from "react";
import classNames from "classnames";

import { DrawTypeContext } from "../index";
import { ActiveButtonContext } from "./Toolbar";

const ToolbarButton = ({ children, purpose, feature }) => {
  // console.log(children, purpose, feature);

  const { setDrawType } = useContext(DrawTypeContext);
  const { activeButton, setActiveButton } = useContext(ActiveButtonContext);

  const buttonClass = classNames("toolbar__button", {
    "toolbar__button--active":
      activeButton.purpose === purpose && activeButton.feature === feature,
  });

  function click(e) {
    e.stopPropagation();
    // setBtnClick((preSatae) => !preSatae);
    // console.log(purpose, feature);
    if (purpose === "draw") {
      setDrawType(feature);
    } else {
      setDrawType("");
    }
    if (activeButton.purpose === purpose && activeButton.feature === feature) {
      setActiveButton({});
      setDrawType("");
    } else {
      setActiveButton(() => ({ purpose: purpose, feature: feature }));
    }
  }

  return (
    <div className={buttonClass} onClick={click}>
      {children}
    </div>
  );
};

export default ToolbarButton;
