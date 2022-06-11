import React from "react";

const Process = ({ item }) => {
  let { x, y, width, height, pointerEvents } = item;
  let { fill, fillOpacity, stroke, strokeWidth, strokeDasharray } =
    item.decorate;

  // if (selected) {
  //   x -= 4;
  //   y -= 4;
  //   width += 8;
  //   height += 8;

  //   strokeDasharray = "6";
  // }

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
