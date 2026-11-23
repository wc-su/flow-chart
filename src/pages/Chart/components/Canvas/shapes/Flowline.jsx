const Flowline = ({ shape, newRate }) => {
  const { startX, startY, endX, endY, pointerEvents } = shape;
  const { stroke, strokeWidth } = shape.style;

  const unit = 10;
  const distance = Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2));
  const degree = (Math.acos((endX - startX) / distance) * 180) / Math.PI;
  const degree2 = endY < startY ? 180 - degree : -(180 - degree);
  const arrowX1 = unit * Math.cos((degree2 - 15) * (Math.PI / 180)) + endX;
  const arrowY1 = unit * Math.sin((degree2 - 15) * (Math.PI / 180)) + endY;
  const arrowX2 = unit * Math.cos((degree2 + 15) * (Math.PI / 180)) + endX;
  const arrowY2 = unit * Math.sin((degree2 + 15) * (Math.PI / 180)) + endY;

  const lineD = `M ${startX * newRate} ${startY * newRate} L ${endX * newRate} ${endY * newRate}`;

  return (
    <>
      {/* 1. 看得到的線：負責顯示，不接收滑鼠 */}
      <path d={lineD} stroke={stroke} strokeWidth={strokeWidth * newRate} pointerEvents="none"></path>
      {/* 2. 看不到的線：透明、比較粗，負責接收滑鼠 */}
      <path
        d={lineD}
        stroke="transparent"
        strokeWidth={12} // 寬度不乘上 newRate，點擊範圍在螢幕上固定是 12px
        pointerEvents="stroke"
        strokeLinecap="round"
      ></path>
      {distance > 0 && (
        <path
          d={`M ${endX * newRate} ${endY * newRate} L ${arrowX1 * newRate} ${
            arrowY1 * newRate
          } L ${arrowX2 * newRate} ${arrowY2 * newRate} Z`}
          fill={stroke}
          stroke={stroke}
          strokeWidth={strokeWidth * newRate}
          pointerEvents={pointerEvents}
        ></path>
      )}
    </>
  );
};

export default Flowline;
