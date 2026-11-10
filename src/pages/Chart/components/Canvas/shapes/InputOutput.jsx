const InputOutput = ({ shape, newRate }) => {
  const { x, y, width, height, pointerEvents } = shape;
  const { fill, fillOpacity, stroke, strokeWidth, strokeMiterlimit } = shape.style;

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
