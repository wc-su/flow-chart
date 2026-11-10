const Ellipse = ({ shape, newRate }) => {
  const { x, y, width, height, pointerEvents } = shape;
  const { fill, stroke } = shape.style;

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
