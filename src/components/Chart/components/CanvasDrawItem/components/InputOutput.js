import React from "react";

const InputOutput = ({ item }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, fillOpacity, stroke, strokeWidth, strokeMiterlimit } =
    item.decorate;

  const d = `M ${x} ${y + height} L ${x + width / 4} ${y} L ${
    x + width
  } ${y} L ${x + (width / 4) * 3} ${y + height} Z`;

  return (
    <path
      d={d}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeMiterlimit={strokeMiterlimit}
      pointerEvents={pointerEvents}
    ></path>
  );
};

export default InputOutput;
