const Process = ({ shape, newRate }) => {
  const { x, y, width, height, pointerEvents } = shape;
  const { fill, fillOpacity, stroke, strokeWidth, strokeDasharray } = shape.style;

  return (
    <rect
      x={x * newRate}
      y={y * newRate}
      width={width * newRate}
      height={height * newRate}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth * newRate}
      strokeDasharray={strokeDasharray}
      pointerEvents={pointerEvents}
    ></rect>
  );
};

export default Process;
