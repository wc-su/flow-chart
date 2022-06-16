import { v4 as uuidv4 } from "uuid";

function startDrawFun(x, y, drawType) {
  return {
    index: uuidv4(),
    startX: x,
    startY: y,
    endX: x,
    endY: y,
    x: x,
    y: y,
    width: 0,
    height: 0,
    type: drawType,
    decorate: {
      fill: "#FFFFFF",
      fillOpacity: "0",
      stroke: "#000000",
      strokeWidth: "1.3",
      strokeMiterlimit: 10,
      strokeDasharray: "0",
    },
    cursor: "move",
    pointerEvents: "all",
    display: "block",
  };
}
function drawingFun() {}
function endDrawFun() {}
function startMove() {}
function movingFun() {}
function endMove() {}
function startResize() {}
function movingResize() {}
function endResize() {}

export { startDrawFun, drawingFun, endDrawFun, movingFun };
