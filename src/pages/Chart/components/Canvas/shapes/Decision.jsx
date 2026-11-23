const Decision = ({ shape, newRate }) => {
  const { x, y, width, height, pointerEvents } = shape;
  const { fill, fillOpacity, stroke, strokeWidth, strokeMiterlimit } = shape.style;

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
      strokeWidth={strokeWidth * newRate}
      strokeMiterlimit={strokeMiterlimit}
      pointerEvents={pointerEvents}
    ></path>
  );
};

export default Decision;
