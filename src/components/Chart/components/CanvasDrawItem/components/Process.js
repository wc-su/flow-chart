import React from "react";

const Process = ({ item, newRate }) => {
  let { x, y, width, height, pointerEvents } = item;
  let { fill, fillOpacity, stroke, strokeWidth, strokeDasharray } =
    item.decorate;

  return (
    <rect
      x={x * newRate}
      y={y * newRate}
      width={width * newRate}
      height={height * newRate}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      pointerEvents={pointerEvents}
    ></rect>
  );
};

export default Process;
