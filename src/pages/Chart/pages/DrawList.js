import React from "react";

import DrawItem from "../pages/DrawItem";

const DrawList = ({ data, drawItemClick, setDrawIndex }) => {
  // let newArray=[];

  // if (selected) {
  //   // console.log("DrawList.js", data.length, selected, data);
  //   // newData = [...data];
  //   let newData = JSON.parse(JSON.stringify(data));
  //   newArray.push(newData);

  // }
  return (
    <g>
      {data.map((item) => {
        return (
          <DrawItem
            key={item.index}
            item={item}
            drawItemClick={drawItemClick}
            setDrawIndex={setDrawIndex}
          />
        );
      })}
    </g>
  );
};

export default DrawList;
