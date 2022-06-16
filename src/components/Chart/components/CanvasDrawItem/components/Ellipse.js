import React from "react";

const Ellipse = ({ item, newRate }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, stroke } = item.decorate;

  return (
    <ellipse
      cx={x * newRate}
      cy={y * newRate}
      rx={width * newRate}
      ry={height * newRate}
      fill={fill}
      stroke={stroke}
      pointerEvents={pointerEvents}
    ></ellipse>
  );
};

export default Ellipse;
