import React from "react";

const Decision = ({ item }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, fillOpacity, stroke, strokeWidth, strokeMiterlimit } =
    item.decorate;

  return (
    <path
      d={`M ${x + width / 2} ${y} L ${x + width} ${y + height / 2} L ${
        x + width / 2
      } ${y + height} L ${x} ${y + height / 2} Z`}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeMiterlimit={strokeMiterlimit}
      pointerEvents={pointerEvents}
    ></path>
  );
};

export default Decision;
