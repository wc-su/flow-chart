const Terminal = ({ shape, newRate }) => {
  const { x, y, width, height, pointerEvents } = shape;
  const { fill, fillOpacity, stroke, strokeWidth } = shape.style;

  return (
    <rect
      x={x * newRate}
      y={y * newRate}
      width={width * newRate}
      height={height * newRate}
      rx={Math.min(width, height) * 0.3 * newRate}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth * newRate}
      pointerEvents={pointerEvents}
    ></rect>
  );
};

export default Terminal;
