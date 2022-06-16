import React from "react";

const Decision = ({ item, newRate }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, fillOpacity, stroke, strokeWidth, strokeMiterlimit } =
    item.decorate;

  return (
    <path
      d={`M ${(x + width / 2) * newRate} ${y * newRate} L ${
        (x + width) * newRate
      } ${(y + height / 2) * newRate} L ${(x + width / 2) * newRate} ${
        (y + height) * newRate
      } L ${x * newRate} ${(y + height / 2) * newRate} Z`}
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
