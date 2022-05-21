import React, { useState, useEffect } from "react";

const Flowline = ({ item }) => {
  const { startX, startY, endX, endY, width, height, pointerEvents } = item;
  const { fill, stroke, strokeWidth, strokeMiterlimit } = item.decorate;

  const unit = 5;
  const lineEndX = endX > startX ? endX - unit : endX + unit;
  const lineEndY = endY > startY ? endY - unit : endY + unit;
  let arrowX2 = endX > startX ? endX - unit : endX + unit;
  let arrowY2 = endY > startY ? endY - unit * 2 : endY + unit * 2;
  let arrowX3 = endX > startX ? endX - unit * 2 : endX + unit * 2;
  let arrowY3 = endY > startY ? endY - unit : endY + unit;

  const degree = (Math.atan(width / height) * 180) / Math.PI;
  // if(endX >= startX && endY <= startY) {
  //   // console.log(`degree: ${degree}, ${degree - 15}, ${90 - degree - 15}`);
  //   const degree2 = degree - 15 >= 0 ? degree - 15 : 0;
  //   const degree3 = 90 - degree - 15 >= 0 ? 90 - degree - 15 : 0;
  //   console.log(`degree: ${degree}, ${degree2}, ${degree3}`);
  //   const arrowX2T = unit * Math.sin(degree2 * (Math.PI / 180));
  //   const arrowY2T = unit * Math.cos(degree2 * (Math.PI / 180));
  //   const arrowX3T = unit * Math.cos(degree3 * (Math.PI / 180));
  //   const arrowY3T = unit * Math.sin(degree3 * (Math.PI / 180));
  //   arrowX2 = endX - arrowX2T;
  //   arrowY2 = endY + arrowY2T;
  //   arrowX3 = endX - arrowX3T;
  //   arrowY3 = endY + arrowY3T;
  //   console.log(`${arrowX2T}, ${arrowY2T}, ${arrowX3T}, ${arrowY3T}`);
  //   console.log(`end X/Y: ${endX}, ${endY}; X2/Y2: ${arrowX2}, ${arrowY2}; X3/Y3: ${arrowX3}, ${arrowY3}`);
  // }
  // console.log(
  //   `Flowline: start X/Y: ${startX}, ${startY}; end X/Y: ${endX}, ${endY} => ${lineEndX}, ${lineEndY}`
  // );

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
        // d={`M ${startX} ${startY} L ${lineEndX} ${lineEndY}`}
        d={`M ${startX} ${startY} L ${arrowX2} ${arrowY3}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeMiterlimit={strokeMiterlimit}
        pointerEvents="stroke"
      ></path>
      <path
        d={`M ${endX} ${endY} L ${arrowX2} ${arrowY2} L ${lineEndX} ${lineEndY} L ${arrowX3} ${arrowY3} Z`}
        // d={`M ${endX} ${endY} L ${arrowX2} ${arrowY2} L ${arrowX3} ${arrowY3} Z`}
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
