import React, { useRef, useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./index.scss";

import { DrawTypeContext } from "../../index";
import CanvasDrawList from "../CanvasDrawList";
import { chartActions } from "../../../../redux/chartReducer";

const Canvas = ({
  canvasRate,
  svgRef,
  moveCanvas,
  setActiveButton,
  targetIndex,
  targetPoint,
}) => {
  const dispatch = useDispatch();
  const newRate = canvasRate.current / 100;

  const { data, targetData } = useSelector((state) => state.chart);

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

        const x =
          (e.clientX - canvasPosition.current.x - canvasInset.left) / newRate;
        const y =
          (e.clientY - canvasPosition.current.y - canvasInset.top) / newRate;
        dispatch(
          chartActions.startDraw({
            x,
            y,
            drawType,
            targetIndex: targetIndex.current,
            targetPoint: targetPoint.current,
          })
        );
      } else if (drawStatus.current === 5 || drawStatus.current === 8) {
        moveInitData.current = {
          item: JSON.parse(
            JSON.stringify(
              data.find((element) => element.index === targetIndex.current)
            )
          ),
          mouseStartX: e.clientX,
          mouseStartY: e.clientY,
        };
        dispatch(
          chartActions.drawTargetData({
            targetIndex: targetIndex.current,
            targetPoint: targetPoint.current,
          })
        );
      }
    }
  }
  function mouseMove(e) {
    if (drawStatus.current === 1) {
      const canvasInset = getCanvasPos();
      const newData = JSON.parse(JSON.stringify(data));
      const index = newData.length - 1;

      const endX =
        (e.clientX - canvasPosition.current.x - canvasInset.left) / newRate;
      const endY =
        (e.clientY - canvasPosition.current.y - canvasInset.top) / newRate;
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
      dispatch(
        chartActions.drawing({
          data: newData,
          targetIndex: targetIndex.current,
          targetPoint: targetPoint.current,
        })
      );
    } else if (drawStatus.current === 5) {
      const distancsX =
        (e.clientX - moveInitData.current.mouseStartX) / newRate;
      const distancsY =
        (e.clientY - moveInitData.current.mouseStartY) / newRate;
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
      dispatch(
        chartActions.changeData({
          data: newData,
          targetIndex: targetIndex.current,
          targetPoint: targetPoint.current,
        })
      );
    } else if (drawStatus.current === 8) {
      const newData = JSON.parse(JSON.stringify(data));
      const newItem = newData.find(
        (element) => element.index === targetIndex.current
      );
      const initItem = moveInitData.current.item;
      switch (targetPoint.current) {
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
      const endX =
        (e.clientX - canvasPosition.current.x - canvasInset.left) / newRate;
      const endY =
        (e.clientY - canvasPosition.current.y - canvasInset.top) / newRate;

      if (targetPoint.current === "start-resize") {
        newItem.startX = endX;
        newItem.startY = endY;
      } else if (targetPoint.current === "end-resize") {
        newItem.endX = endX;
        newItem.endY = endY;
      } else {
        newItem.endX = endX;
        newItem.endY = endY;
      }
      if (!["n-resize", "s-resize"].includes(targetPoint.current)) {
        if (endX >= newItem.startX) {
          newItem.width = endX - newItem.startX;
        } else {
          newItem.width = newItem.startX - endX;
          newItem.x = endX;
        }
      }
      if (!["w-resize", "e-resize"].includes(targetPoint.current)) {
        if (endY >= newItem.startY) {
          newItem.height = endY - newItem.startY;
        } else {
          newItem.height = newItem.startY - endY;
          newItem.y = endY;
        }
      }
      if (targetPoint.current === "start-resize") {
        newItem.width = Math.abs(newItem.startX - newItem.endX);
        newItem.height = Math.abs(newItem.startY - newItem.endY);
      }
      dispatch(
        chartActions.changeData({
          data: newData,
          targetIndex: targetIndex.current,
          targetPoint: targetPoint.current,
        })
      );
    } else if (drawStatus.current === 15) {
      const distanceX = e.clientX - moveInitData.current.mouseStartX;
      const distanceY = e.clientY - moveInitData.current.mouseStartY;
      const canvasInset = moveInitData.current.canvasInset;
      canvasRef.current.style.top = `${canvasInset.top + distanceY}px`;
      canvasRef.current.style.left = `${canvasInset.left + distanceX}px`;
    }
  }
  function mouseUp(e) {
    if (moveCanvas) {
      canvasRef.current.style.cursor = "grab";
    } else {
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
        dispatch(
          chartActions.endDraw({
            data: newData,
            targetIndex: targetIndex.current,
            targetPoint: targetPoint.current,
          })
        );
        setActiveButton({});
        setDrawType("");
      } else if (drawStatus.current === 5) {
        const oldItem = moveInitData.current.item;
        const newItem = data.find((item) => item.index === targetIndex.current);
        if (
          oldItem.x === newItem.x &&
          oldItem.y === newItem.y &&
          oldItem.width === newItem.width &&
          oldItem.height === newItem.height
        ) {
        } else {
          dispatch(
            chartActions.endDraw({
              data,
              targetIndex: targetIndex.current,
              targetPoint: targetPoint.current,
            })
          );
        }
      } else if (drawStatus.current === 8) {
        const newData = JSON.parse(JSON.stringify(data));
        const newItem = newData.find(
          (element) => element.index == targetIndex.current
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
        targetPoint.current = "";
        dispatch(
          chartActions.endDraw({
            data: newData,
            targetIndex: targetIndex.current,
            targetPoint: targetPoint.current,
          })
        );
      }
    }
  }
  function click(e) {
    let changeTargetIndex = false;
    if (drawStatus.current === 2) {
      targetIndex.current = data[data.length - 1].index;
      changeTargetIndex = true;
    } else if (drawStatus.current === 3) {
      targetIndex.current = -1;
      changeTargetIndex = true;
    } else if (drawStatus.current === 10) {
      targetIndex.current = -1;
      changeTargetIndex = true;
    } else if (drawStatus.current === 0) {
      targetIndex.current = -1;
      changeTargetIndex = true;
    }
    if (changeTargetIndex) {
      dispatch(
        chartActions.drawTargetData({
          targetIndex: targetIndex.current,
          targetPoint: targetPoint.current,
        })
      );
    }
    drawStatus.current = 0;
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
          targetIndex={targetIndex}
          targetPoint={targetPoint}
          newRate={newRate}
        />
        {/* 點選 */}
        <CanvasDrawList
          data={targetData}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          targetIndex={targetIndex}
          targetPoint={targetPoint}
          newRate={newRate}
        />
      </svg>
    </div>
  );
};

export default Canvas;
