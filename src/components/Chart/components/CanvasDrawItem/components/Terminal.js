import React from "react";

const Terminal = ({ item, newRate }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, fillOpacity, stroke, strokeWidth } = item.decorate;

  return (
    <rect
      x={x * newRate}
      y={y * newRate}
      width={width * newRate}
      height={height * newRate}
      rx={width * 0.3 * newRate}
      ry={width * 0.3 * newRate}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      pointerEvents={pointerEvents}
    ></rect>
  );
};

export default Terminal;
