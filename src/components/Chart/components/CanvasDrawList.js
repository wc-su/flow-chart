import React from "react";

import CanvasDrawItem from "./CanvasDrawItem";

const CanvasDrawList = ({
  data,
  canvasPosition,
  drawStatus,
  targetIndex,
  targetPoint,
  newRate,
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
            targetIndex={targetIndex}
            targetPoint={targetPoint}
            newRate={newRate}
          />
        );
      })}
    </g>
  );
};

export default CanvasDrawList;
