// 控制點的點擊半徑 (螢幕 px)，要比 Flowline 透明線的半寬 6 大，靠近端點時才會先碰到控制點
const HANDLE_HIT_RADIUS = 8;

const Ellipse = ({ shape, newRate }) => {
  const { x, y, width, height, pointerEvents } = shape;
  const { fill, stroke } = shape.style;

  return (
    <>
      {/* 1. 看得到的點：負責顯示，不接收滑鼠 */}
      <ellipse
        cx={x * newRate}
        cy={y * newRate}
        rx={width}
        ry={height}
        fill={fill}
        stroke={stroke}
        pointerEvents="none"
      ></ellipse>
      {/* 2. 看不到的點：透明、比較大，負責接收滑鼠 */}
      <ellipse
        cx={x * newRate}
        cy={y * newRate}
        rx={HANDLE_HIT_RADIUS}
        ry={HANDLE_HIT_RADIUS}
        fill="transparent"
        pointerEvents={pointerEvents}
      ></ellipse>
    </>
  );
};

export default Ellipse;
