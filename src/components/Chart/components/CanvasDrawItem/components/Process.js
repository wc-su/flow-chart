import React from "react";

const Process = ({ item }) => {
  let { x, y, width, height, pointerEvents } = item;
  let { fill, fillOpacity, stroke, strokeWidth, strokeDasharray } =
    item.decorate;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
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
