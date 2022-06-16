import React, { useRef, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import "./index.scss";

import { DrawTypeContext } from "../../index";
import CanvasDrawList from "../CanvasDrawList";
import { chartActions } from "../../../../model/chartReducer";

const Canvas = ({
  canvasRate,
  chartIndex,
  resizeDirection,
  svgRef,
  dataSelected,
  drawPoint2,
  handleRerender,
  tempFlag,
  moveCanvas,
}) => {
  const dispatch = useDispatch();
  const newRate = canvasRate.current / 100;

  const { data } = useSelector((state) => state.chart);

  // 取得畫布的起始座標
  const canvasRef = useRef();
  const canvasPosition = useRef({});
  const svgPos = useRef({});

  // 狀態：
  // 0: 初始
  // 1: 畫圖、 2: 畫圖結束、3: 畫圖錯誤
  // 5: 移動、 7: 移動結束
  // 8: 調整開始、9: 調整、10: 調整結束
  const drawStatus = useRef(0);

  const moveInitData = useRef();

  const { drawType, setDrawType } = useContext(DrawTypeContext);

  const [screenSize, setScreenSize] = useState({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  });

  if (canvasRef.current) {
    if (drawType !== "" && !moveCanvas) {
      canvasRef.current.style.cursor = "crosshair";
    } else if (moveCanvas) {
      canvasRef.current.style.cursor = "grab";
    } else {
      canvasRef.current.style.cursor = "default";
    }
  }

  const detectResize = () => {
    setScreenSize({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectResize);
    return () => {
      window.removeEventListener("resize", detectResize);
    };
  }, [screenSize]);

  useEffect(() => {
    if (canvasRef) {
      canvasPosition.current = canvasRef.current.getBoundingClientRect();
      svgPos.current = {
        x: screenSize.screenWidth,
        y: screenSize.screenHeight - canvasPosition.current.y,
        width: screenSize.screenWidth * 3,
        height: (screenSize.screenHeight - canvasPosition.current.y) * 2,
      };
    }
  }, [canvasRef]);

  function mouseDown(e) {
    console.log("Canvas.js -> mouse down", drawStatus.current, drawType);
    if (![5, 8].includes(drawStatus.current)) {
      drawStatus.current = 0;
    }
    if (moveCanvas) {
      canvasRef.current.style.cursor = "grabbing";
      drawStatus.current = 15;
      const canvasInset = getCanvasPos();
      moveInitData.current = {
        canvasInset: canvasInset,
        mouseStartX: e.clientX,
        mouseStartY: e.clientY,
      };
    } else {
      if (drawStatus.current === 0 && drawType) {
        const canvasInset = getCanvasPos();
        drawStatus.current = 1;

        const x = e.clientX - canvasPosition.current.x - canvasInset.left;
        const y = e.clientY - canvasPosition.current.y - canvasInset.top;
        const newData = JSON.parse(JSON.stringify(data));
        newData.push({
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
        });
        drawPoint2(newData);
        dispatch(chartActions.startDraw(newData));
      } else if (drawStatus.current === 5 || drawStatus.current === 8) {
        drawPoint2(data);
        handleRerender();
        moveInitData.current = {
          item: JSON.parse(
            JSON.stringify(
              data.find((element) => element.index === chartIndex.current)
            )
          ),
          mouseStartX: e.clientX,
          mouseStartY: e.clientY,
        };
      }
    }
  }
  function mouseMove(e) {
    if (drawStatus.current === 1) {
      const canvasInset = getCanvasPos();
      const newData = JSON.parse(JSON.stringify(data));
      const index = newData.length - 1;

      const endX = e.clientX - canvasPosition.current.x - canvasInset.left;
      const endY = e.clientY - canvasPosition.current.y - canvasInset.top;
      newData[index].endX = endX;
      newData[index].endY = endY;
      if (endX >= newData[index].startX) {
        newData[index].width = endX - newData[index].x;
      } else {
        newData[index].width = newData[index].startX - endX;
        newData[index].x = endX;
      }
      if (endY >= newData[index].startY) {
        newData[index].height = endY - newData[index].y;
      } else {
        newData[index].height = newData[index].startY - endY;
        newData[index].y = endY;
      }
      drawPoint2(newData);
      dispatch(chartActions.drawing(newData));
    } else if (drawStatus.current === 5) {
      const distancsX = e.clientX - moveInitData.current.mouseStartX;
      const distancsY = e.clientY - moveInitData.current.mouseStartY;
      const initItem = moveInitData.current.item;
      const newData = JSON.parse(JSON.stringify(data));
      const newItem = newData.find(
        (element) => element.index == initItem.index
      );
      newItem.x = initItem.x + distancsX;
      newItem.y = initItem.y + distancsY;
      newItem.startX = initItem.startX + distancsX;
      newItem.startY = initItem.startY + distancsY;
      newItem.endX = initItem.endX + distancsX;
      newItem.endY = initItem.endY + distancsY;
      drawPoint2(newData);
      dispatch(chartActions.changeData(newData));
    } else if (drawStatus.current === 8) {
      const newData = JSON.parse(JSON.stringify(data));
      const newItem = newData.find(
        (element) => element.index === chartIndex.current
      );
      const initItem = moveInitData.current.item;
      switch (resizeDirection.current) {
        case "nw-resize":
          newItem.x = initItem.endX;
          newItem.y = initItem.endY;
          newItem.startX = initItem.endX;
          newItem.startY = initItem.endY;
          break;
        case "n-resize":
          newItem.y = initItem.endY;
          newItem.startY = initItem.endY;
          break;
        case "ne-resize":
          newItem.y = initItem.endY;
          newItem.startY = initItem.endY;
          break;
        case "w-resize":
          newItem.x = initItem.endX;
          newItem.startX = initItem.endX;
          break;
        case "e-resize":
          break;
        case "sw-resize":
          newItem.x = initItem.endX;
          newItem.startX = initItem.endX;
          break;
        case "s-resize":
          break;
        case "se-resize":
          break;
      }

      const canvasInset = getCanvasPos();
      const endX = e.clientX - canvasPosition.current.x - canvasInset.left;
      const endY = e.clientY - canvasPosition.current.y - canvasInset.top;

      if (resizeDirection.current === "start-resize") {
        newItem.startX = endX;
        newItem.startY = endY;
      } else if (resizeDirection.current === "end-resize") {
        newItem.endX = endX;
        newItem.endY = endY;
      } else {
        newItem.endX = endX;
        newItem.endY = endY;
      }
      if (!["n-resize", "s-resize"].includes(resizeDirection.current)) {
        if (endX >= newItem.startX) {
          newItem.width = endX - newItem.startX;
        } else {
          newItem.width = newItem.startX - endX;
          newItem.x = endX;
        }
      }
      if (!["w-resize", "e-resize"].includes(resizeDirection.current)) {
        if (endY >= newItem.startY) {
          newItem.height = endY - newItem.startY;
        } else {
          newItem.height = newItem.startY - endY;
          newItem.y = endY;
        }
      }
      if (resizeDirection.current === "start-resize") {
        newItem.width = Math.abs(newItem.startX - newItem.endX);
        newItem.height = Math.abs(newItem.startY - newItem.endY);
      }
      drawPoint2(newData);
      dispatch(chartActions.changeData(newData));
    } else if (drawStatus.current === 15) {
      const distanceX = e.clientX - moveInitData.current.mouseStartX;
      const distanceY = e.clientY - moveInitData.current.mouseStartY;
      const canvasInset = moveInitData.current.canvasInset;
      canvasRef.current.style.top = `${canvasInset.top + distanceY}px`;
      canvasRef.current.style.left = `${canvasInset.left + distanceX}px`;
    }
  }
  function mouseUp(e) {
    if (drawStatus.current === 1) {
      const newData = JSON.parse(JSON.stringify(data));
      const index = newData.length - 1;
      if (drawType !== "flowline") {
        newData[index].startX = newData[index].x;
        newData[index].startY = newData[index].y;
        newData[index].endX = newData[index].x + newData[index].width;
        newData[index].endY = newData[index].y + newData[index].height;
      }

      if (newData[index].width === 0 || newData[index].height === 0) {
        newData.pop();
        drawStatus.current = 3;
      } else {
        drawStatus.current = 2;
      }
      drawPoint2(newData);
      dispatch(chartActions.endDraw(newData));
      tempFlag.current = true;
      setDrawType("");
    } else if (drawStatus.current === 8) {
      const newData = JSON.parse(JSON.stringify(data));
      const newItem = newData.find(
        (element) => element.index == chartIndex.current
      );
      if (newItem.type !== "flowline") {
        newItem.startX = newItem.x;
        newItem.startY = newItem.y;
        newItem.endX = newItem.x + newItem.width;
        newItem.endY = newItem.y + newItem.height;
      }

      if (newItem.width === 0 || newItem.height === 0) {
        drawStatus.current = 10;
      } else {
        drawStatus.current = 9;
      }
      resizeDirection.current = "";
      drawPoint2(newData);
      dispatch(chartActions.endDraw(newData));
    }
  }
  function click(e) {
    if (drawStatus.current === 2) {
      chartIndex.current = data[data.length - 1].index;
    } else if (drawStatus.current === 3) {
      chartIndex.current = -1;
    } else if (drawStatus.current === 5) {
    } else if (drawStatus.current === 9) {
    } else if (drawStatus.current === 10) {
      chartIndex.current = -1;
    } else if (drawStatus.current === 0) {
      chartIndex.current = -1;
    }
    drawStatus.current = 0;
    drawPoint2(data);
    handleRerender();
  }

  function getCanvasPos() {
    return {
      top: parseInt(canvasRef.current.style.top.replace("px", "")),
      left: parseInt(canvasRef.current.style.left.replace("px", "")),
    };
  }

  return (
    <div
      ref={canvasRef}
      className="canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${600 * newRate}px`,
        height: `${800 * newRate}px`,
        boxShadow: "0 0 5px #b4b4b4",
        backgroundColor: "#fff",
      }}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onClick={click}
    >
      <svg
        className="canvas__svgBg"
        width={600 * newRate}
        height={800 * newRate}
        viewBox={`0 0 ${600 * newRate} ${800 * newRate}`}
        id="svgXXX"
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 畫圖 */}
        <CanvasDrawList
          data={data}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          resizeDirection={resizeDirection}
        />
        {/* 點選 */}
        <CanvasDrawList
          data={dataSelected.current}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          resizeDirection={resizeDirection}
        />
      </svg>
    </div>
  );
};

export default Canvas;
