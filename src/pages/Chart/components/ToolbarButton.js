import React, { useState, useRef } from "react";
import classNames from "classnames";

const ToolbarButton = ({
  children,
  purpose,
  feature,
  setDrawType,
  activeButton,
  setActiveButton,
}) => {
  // console.log(children, purpose, feature);
  const buttonClass = classNames("toolbar__button", {
    "toolbar__button--active":
      activeButton.purpose === purpose && activeButton.feature === feature,
  });

  function click(e) {
    e.stopPropagation();
    // setBtnClick((preSatae) => !preSatae);
    // console.log(purpose, feature);
    if (activeButton.purpose === purpose && activeButton.feature === feature) {
      setActiveButton({});
    } else {
      setActiveButton(() => ({ purpose: purpose, feature: feature }));
    }
    if (purpose === "draw") {
      setDrawType(feature);
    } else {
      setDrawType("");
    }
  }

  return (
    <div className={buttonClass} onClick={click}>
      {children}
    </div>
  );
};

export default ToolbarButton;
