import React from "react";

const ToolDropdownItem = ({
  children,
  index,
  changeSelected,
  setPop,
  isMounted,
}) => {
  // console.log("eeee");
  function handleDropItemClick(e) {
    console.log("handelDorpItem:");
    e.stopPropagation();
    if (changeSelected) {
      isMounted.current = true;
      changeSelected(index);
      setPop(false);
    }
  }

  return (
    <div className="toolItem__container" onClick={handleDropItemClick}>
      {children}
    </div>
  );
};

export default ToolDropdownItem;
