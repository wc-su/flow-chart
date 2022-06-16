import React from "react";

const InputOutput = ({ item, newRate }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, fillOpacity, stroke, strokeWidth, strokeMiterlimit } =
    item.decorate;

  const d = `M ${x * newRate} ${(y + height) * newRate} L ${
    (x + width / 4) * newRate
  } ${y * newRate} L ${(x + width) * newRate} ${y * newRate} L ${
    (x + (width / 4) * 3) * newRate
  } ${(y + height) * newRate} Z`;

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
