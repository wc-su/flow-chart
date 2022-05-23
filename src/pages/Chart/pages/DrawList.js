import React, { useContext } from "react";

import DrawItem from "../pages/DrawItem";

const DrawList = ({
  data,
  canvasPosition,
  drawStatus,
  chartIndex,
  resizeDirection,
  test,
}) => {
  // if (test) {
  //   console.log("DrawList.js:", test, data);
  // }
  return (
    <g>
      {data.map((item) => {
        return (
          <DrawItem
            key={item.index}
            item={item}
            canvasPosition={canvasPosition}
            drawStatus={drawStatus}
            chartIndex={chartIndex}
            resizeDirection={resizeDirection}
          />
        );
      })}
    </g>
  );
};

export default DrawList;
