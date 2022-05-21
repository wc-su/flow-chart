import React, { useState, useEffect } from "react";

const Flowline = ({ item }) => {
  const { startX, startY, endX, endY, width, height, pointerEvents } = item;
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
  // console.log(`end X/Y: ${endX}, ${endY}; ${distance}, ${degree}; new3 X/Y: ${arrowX1}, ${arrowY1}, new4 X/Y: ${arrowX2}, ${arrowY2}`);

  return (
    <g>
      {/* <path
        d={`M ${startX} ${startY} L ${lineEndX} ${lineEndY}`}
        fill={fill}
        stroke={stroke}
        strokeWidth="9.3"
        strokeMiterlimit={strokeMiterlimit}
        pointerEvents="stroke"
        visibility="hidden"
      ></path> */}
      <path
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeMiterlimit={strokeMiterlimit}
        pointerEvents="stroke"
      ></path>
      <path
        d={`M ${endX} ${endY} L ${arrowX1} ${arrowY1} L ${arrowX2} ${arrowY2} Z`}
        fill="rgb(0, 0, 0)"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeMiterlimit={strokeMiterlimit}
        pointerEvents={pointerEvents}
      ></path>
    </g>
  );
};

export default Flowline;
