import React from "react";

const ToolDropdownItem = ({
  children,
  index,
  changeSelected,
  setToolBarPop,
  isMounted,
}) => {
  // console.log("eeee");
  function handleDropItemClick(e) {
    console.log("handelDorpItem:");
    e.stopPropagation();
    if (changeSelected) {
      isMounted.current = true;
      changeSelected(index);
      setToolBarPop("");
    }
  }

  return (
    <div className="toolItem__container" onClick={handleDropItemClick}>
      {children}
    </div>
  );
};

export default ToolDropdownItem;
