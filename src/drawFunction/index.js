import { v4 as uuidv4 } from "uuid";

const pointConfig = [
  { cursor: "nw-resize", x: 0, y: 0 },
  { cursor: "n-resize", x: 0.5, y: 0 },
  { cursor: "ne-resize", x: 1, y: 0 },
  { cursor: "w-resize", x: 0, y: 0.5 },
  { cursor: "e-resize", x: 1, y: 0.5 },
  { cursor: "sw-resize", x: 0, y: 1 },
  { cursor: "s-resize", x: 0.5, y: 1 },
  { cursor: "se-resize", x: 1, y: 1 },
];
const linePointConfig = [
  { cursor: "start-resize", x: 0, y: 0 },
  { cursor: "end-resize", x: 1, y: 1 },
];

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

function drawTarget(data, targetIndex, targetPoint) {
  let originItem = data.find((item) => item.index === targetIndex);
  if (targetIndex !== -1 && originItem) {
    const originData = JSON.parse(JSON.stringify(originItem));
    if (originData.type !== "flowline") {
      const newStartX = Math.min(originData.startX, originData.endX);
      const newStartY = Math.min(originData.startY, originData.endY);
      const newEndX = Math.max(originData.startY, originData.endY);
      const newEndY = Math.max(originData.startY, originData.endY);
      originData.startX = newStartX;
      originData.startY = newStartY;
      originData.x = newStartX;
      originData.y = newStartY;
      originData.endX = newEndX;
      originData.endY = newEndY;
    }

    const initPoint = JSON.parse(JSON.stringify(originData));

    if (originData.type !== "flowline") {
      originData.type = "process";
      originData.decorate.stroke = "#00a8ff";
      originData.decorate.strokeDasharray = "3";
      originData.pointerEvents = "none";
    }

    const newData = [];
    if (targetPoint !== "") {
      originData.display = "none";
    }
    newData.push(originData);

    const pointWidth = initPoint.width;
    const pointHeight = initPoint.height;
    initPoint.decorate.fill = "#00a8ff";
    initPoint.decorate.stroke = "none";
    initPoint.type = "ellipse";
    initPoint.width = 4;
    initPoint.height = 4;

    if (originData.type === "flowline") {
      newData.push({ ...initPoint });
      newData[1].index = uuidv4();
      newData[1].cursor = linePointConfig[0].cursor;
      newData[1].x = newData[1].startX;
      newData[1].y = newData[1].startY;
      newData[1].endX = newData[1].startX;
      newData[1].endY = newData[1].startY;
      if (targetPoint && targetPoint !== linePointConfig[0].cursor) {
        newData[1].display = "none";
      }
      newData.push({ ...initPoint });
      newData[2].index = uuidv4();
      newData[2].cursor = linePointConfig[1].cursor;
      newData[2].startX = newData[2].endX;
      newData[2].startY = newData[2].endY;
      newData[2].x = newData[2].endX;
      newData[2].y = newData[2].endY;
      if (targetPoint && targetPoint !== linePointConfig[1].cursor) {
        newData[2].display = "none";
      }
    } else {
      for (let i = 1; i <= pointConfig.length; i++) {
        newData.push({ ...initPoint });
        newData[i].index = uuidv4();
        newData[i].cursor = pointConfig[i - 1].cursor;
        newData[i].startX += pointWidth * pointConfig[i - 1].x;
        newData[i].startY += pointHeight * pointConfig[i - 1].y;
        newData[i].x = newData[i].startX;
        newData[i].y = newData[i].startY;
        newData[i].endX = newData[i].startX;
        newData[i].endY = newData[i].startY;
        if (targetPoint) {
          newData[i].display =
            pointConfig[i - 1].cursor === targetPoint ? "block" : "none";
        }
      }
    }
    return newData;
  } else {
    return [];
  }
}

export { startDrawFun, drawingFun, endDrawFun, movingFun, drawTarget };
