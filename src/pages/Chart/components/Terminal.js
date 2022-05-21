import React from "react";

const Terminal = ({ item }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, fillOpacity, stroke, strokeWidth } = item.decorate;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={width * 0.3}
      ry={width * 0.3}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      pointerEvents={pointerEvents}
    ></rect>
  );
};

export default Terminal;
