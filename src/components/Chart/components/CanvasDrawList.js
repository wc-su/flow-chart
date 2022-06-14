import React from "react";

import CanvasDrawItem from "./CanvasDrawItem";

const CanvasDrawList = ({
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
          <CanvasDrawItem
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

export default CanvasDrawList;
