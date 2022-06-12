import React from "react";

import DrawItem from "./DrawItem";

const DrawList = ({
  data,
  canvasPosition,
  drawStatus,
  chartIndex,
  resizeDirection,
}) => {
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