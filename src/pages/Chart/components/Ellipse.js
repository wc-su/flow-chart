import React from "react";

const Ellipse = ({ item }) => {
  const { x, y, width, height, pointerEvents } = item;
  const { fill, stroke } = item.decorate;

  return (
    <ellipse
      cx={x}
      cy={y}
      rx={width}
      ry={height}
      fill={fill}
      stroke={stroke}
      pointerEvents={pointerEvents}
    ></ellipse>
  );
};

export default Ellipse;
