import React from "react";

const Flowline = ({ item }) => {
  const { startX, startY, endX, endY, pointerEvents } = item;
  const { fill, stroke, strokeWidth, strokeMiterlimit } = item.decorate;

  const unit = 10;
  const distance = Math.sqrt(
    Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2)
  );
  const degree = (Math.acos((endX - startX) / distance) * 180) / Math.PI;
  const degree2 = endY < startY ? 180 - degree : -(180 - degree);
  const arrowX1 = unit * Math.cos((degree2 - 15) * (Math.PI / 180)) + endX;
  const arrowY1 = unit * Math.sin((degree2 - 15) * (Math.PI / 180)) + endY;
  const arrowX2 = unit * Math.cos((degree2 + 15) * (Math.PI / 180)) + endX;
  const arrowY2 = unit * Math.sin((degree2 + 15) * (Math.PI / 180)) + endY;

  return (
    <g>
      <path
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeMiterlimit={strokeMiterlimit}
        pointerEvents="stroke"
      ></path>
      {distance > 0 && (
        <path
          d={`M ${endX} ${endY} L ${arrowX1} ${arrowY1} L ${arrowX2} ${arrowY2} Z`}
          fill="rgb(0, 0, 0)"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeMiterlimit={strokeMiterlimit}
          pointerEvents={pointerEvents}
        ></path>
      )}
    </g>
  );
};

export default Flowline;
