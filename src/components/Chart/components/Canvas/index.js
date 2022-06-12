import React, { useRef, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

import "./index.scss";

// import { DataContext, DataSelectedContext, DrawTypeContext } from "../index";
import { DataContext, DrawTypeContext } from "../../index";
import DrawList from "./components/DrawList";
// import CanvasStyle from "./CanvasStyle";

const Canvas = ({
  canvasRate,
  chartIndex,
  // drawPoint,
  resizeDirection,
  needSaveStep,
  svgRef,
  canvasBlockRange,
  dataSelected,
  drawPoint2,
  handleRerender,
  tempFlag,
  moveCanvas,
}) => {
  // const newRate = 100 / canvasRate.current;
  const newRate = canvasRate.current / 100;
  // console.log("wwwww", canvasRate.current, newRate);

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

  const { data, setData } = useContext(DataContext);
  // const { dataSelected } = useContext(DataSelectedContext);
  const { drawType, setDrawType } = useContext(DrawTypeContext);

  const [screenSize, setScreenSize] = useState({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
  });
  // const [screenSizeMinusScroll, setScreenSizeMinusScroll] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });
  // const screenSizeMinusScroll = useRef({
  //   width: canvasRef.current ? canvasRef.current.clientWidth : null
  // });

  // const canvasClass = classNames("canvas", {
  //   crosshair: drawType !== "" && !moveCanvas,
  //   grab:
  // });

  // console.log("eeee", drawType, moveCanvas, canvasRef.current);
  if (canvasRef.current) {
    if (drawType !== "" && !moveCanvas) {
      canvasRef.current.style.cursor = "crosshair";
    } else if (moveCanvas) {
      canvasRef.current.style.cursor = "grab";
    } else {
      canvasRef.current.style.cursor = "default";
    }
  }

  // console.log("this", drawType, canvasClass);
  // const canvasOuterClass = {

  // }

  const canvasStyle = {
    // width: "100%",
    // height: "100%",
    // display: "block",
    // minWidth: `${screenSize.screenWidth}px`,
    // minHeight: `${screenSize.screenHeight - canvasPosition.current.y}px`,
    position: "absolute",
    top: "0",
    // top: "10px",
    left: "0",
    // cursor: "crosshair"
  };

  const detectResize = () => {
    // console.log("yyyy");
    setScreenSize({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    // console.log("xxxx", screenSize, canvasRef.current);
    window.addEventListener("resize", detectResize);
    return () => {
      window.removeEventListener("resize", detectResize);
    };
  }, [screenSize]);

  // const detectonScrollResize = () => {
  //   // console.log("yyyy");
  //   setScreenSizeMinusScroll({
  //     screenWidth: window.innerWidth,
  //     screenHeight: window.innerHeight,
  //   });
  // };

  // useEffect(() => {
  //   console.log("xxxx", screenSize, canvasRef.current, screenSizeMinusScroll.current);
  //   window.addEventListener("onScroll", detectonScrollResize);
  //   return () => {
  //     window.removeEventListener("onScroll", detectonScrollResize);
  //   };
  // }, [screenSizeMinusScroll]);

  useEffect(() => {
    // console.log("aaaas", canvasRef);
    if (canvasRef) {
      canvasPosition.current = canvasRef.current.getBoundingClientRect();
      svgPos.current = {
        x: screenSize.screenWidth,
        y: screenSize.screenHeight - canvasPosition.current.y,
        width: screenSize.screenWidth * 3,
        height: (screenSize.screenHeight - canvasPosition.current.y) * 2,
      };

      // screenSizeMinusScroll.current.width = canvasRef.current.clientWidth;
      // screenSizeMinusScroll.current.height = canvasRef.current.clientHeight;
      // console.log("zzzz", canvasPosition.current, screenSizeMinusScroll.current);
    }
  }, [canvasRef]);

  useEffect(() => {
    // console.log(
    //   "Canvas.js -> ussEffect data:",
    //   drawStatus.current,
    //   data.length,
    //   data.length > 0 ? data[data.length - 1].index : -1
    // );
    // if (drawStatus.current === 2) {
    //   // drawPoint();
    // } else if (drawStatus.current === 5) {
    //   drawPoint();
    // } else if (drawStatus.current === 8) {
    //   drawPoint();
    // } else if (drawStatus.current === 9) {
    //   drawPoint();
    // }
  }, [data]);

  function mouseDown(e) {
    console.log("Canvas.js -> mouse down", drawStatus.current, drawType);
    if (![5, 8].includes(drawStatus.current)) {
      drawStatus.current = 0;
    }
    if (moveCanvas) {
      canvasRef.current.style.cursor = "grabbing";
      drawStatus.current = 15;
      const canvasInset = getCanvasPos();
      // console.log("sssss", canvasInset, e.clientX, e.clientY);
      moveInitData.current = {
        canvasInset: canvasInset,
        mouseStartX: e.clientX,
        mouseStartY: e.clientY,
      };
    } else {
      if (drawStatus.current === 0 && drawType) {
        // console.log(
        //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${
        //     e.clientY
        //   }, content X/Y: ${canvasPosition.current.x}, ${canvasPosition.current.y} => ${
        //     e.clientX - canvasPosition.current.x
        //   }, ${e.clientY - canvasPosition.current.y}`
        // );
        const canvasInset = getCanvasPos();
        // console.log(
        //   `canvasPosition X/Y: ${canvasPosition.current.x}, ${canvasPosition.current.y}`
        // );
        // console.log(
        //   `canvasInset Top/Left/Bottom/Right: ${canvasInset.top}, ${canvasInset.left}}`
        // );
        drawStatus.current = 1;
        setData((preData) => {
          // const x = (e.clientX - canvasPosition.current.x) * newRate;
          // const y = (e.clientY - canvasPosition.current.y) * newRate;
          // const x = (e.clientX - canvasInset.left) * newRate;
          // const y = (e.clientY - canvasInset.top) * newRate;
          // const x =
          //   (e.clientX - canvasPosition.current.x - canvasInset.left) * newRate;
          // const y =
          //   (e.clientY - canvasPosition.current.y - canvasInset.top) * newRate;
          const x = e.clientX - canvasPosition.current.x - canvasInset.left;
          const y = e.clientY - canvasPosition.current.y - canvasInset.top;
          // console.log(`start X/Y: ${x}, ${y}`);
          // console.log(`mouse X/Y: ${e.clientX}, ${e.clientY}`);
          const newData = JSON.parse(JSON.stringify(preData));
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
          return newData;
        });
      } else if (drawStatus.current === 5 || drawStatus.current === 8) {
        // drawPoint();
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
    // console.log(
    //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${e.clientY}`
    // );
    // console.log("mouse move:", drawStatus.current);

    if (drawStatus.current === 1) {
      const canvasInset = getCanvasPos();
      // console.log("mouse move", chartIndex.current);
      setData((preData) => {
        const newData = JSON.parse(JSON.stringify(preData));
        const index = newData.length - 1;

        // const endX =
        //   (e.clientX - canvasPosition.current.x - canvasInset.left) * newRate;
        //   const endY =
        //   (e.clientY - canvasPosition.current.y - canvasInset.top) * newRate;
        const endX = e.clientX - canvasPosition.current.x - canvasInset.left;
        const endY = e.clientY - canvasPosition.current.y - canvasInset.top;
        // let endX = (e.clientX - canvasPosition.current.x) * newRate;
        // let endY = (e.clientY - canvasPosition.current.y) * newRate;
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
        // console.log(
        //   `X/Y: ${newData[index].x}, ${newData[index].y}; end X/Y: ${endX}, ${endY}; W/H: ${newData[index].width}, ${newData[index].height}`
        // );
        drawPoint2(newData);
        return newData;
      });
    } else if (drawStatus.current === 5) {
      // const distancsX = (e.clientX - moveInitData.current.mouseStartX) * newRate;
      // const distancsY = (e.clientY - moveInitData.current.mouseStartY) * newRate;
      const distancsX = e.clientX - moveInitData.current.mouseStartX;
      const distancsY = e.clientY - moveInitData.current.mouseStartY;
      const initItem = moveInitData.current.item;
      setData((preData) => {
        const newData = JSON.parse(JSON.stringify(preData));
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
        return newData;
      });
    } else if (drawStatus.current === 8) {
      setData((preData) => {
        const newData = JSON.parse(JSON.stringify(preData));
        const newItem = newData.find(
          (element) => element.index == chartIndex.current
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
        // let endX = (e.clientX - canvasPosition.current.x - canvasInset.left) * newRate;
        // let endY = (e.clientY - canvasPosition.current.y - canvasInset.top) * newRate;
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
        return newData;
      });
    } else if (drawStatus.current === 15) {
      // console.log(`mouse init X/Y: ${moveInitData.current.mouseStartX}, ${moveInitData.current.mouseStartY}`);
      // console.log(`mouse mow X/Y: ${e.clientX}, ${e.clientY}`);
      // const distanceX = (e.clientX - moveInitData.current.mouseStartX) * newRate;
      // const distanceY = (e.clientY - moveInitData.current.mouseStartY) * newRate;
      const distanceX = e.clientX - moveInitData.current.mouseStartX;
      const distanceY = e.clientY - moveInitData.current.mouseStartY;
      // console.log("=> ", distanceX, distanceY);
      const canvasInset = moveInitData.current.canvasInset;
      // console.log("=> ", canvasInset.left + distanceX, canvasInset.top + distanceY);
      // canvasInset.top - distanceX;
      // canvasInset.left + distanceY;
      // canvasInset.bottom + distanceX;
      // canvasInset.right - distanceY;
      // console.log(canvasInset);
      canvasRef.current.style.top = `${canvasInset.top + distanceY}px`;
      canvasRef.current.style.left = `${canvasInset.left + distanceX}px`;
    }
  }
  function mouseUp(e) {
    // console.log(
    //   "Canvas.js -> mouse up",
    //   drawStatus.current,
    //   chartIndex.current,
    //   drawType
    // );
    if (drawStatus.current === 1) {
      setData((preData) => {
        const newData = JSON.parse(JSON.stringify(preData));
        const index = newData.length - 1;
        if (drawType !== "flowline") {
          newData[index].startX = newData[index].x;
          newData[index].startY = newData[index].y;
          newData[index].endX = newData[index].x + newData[index].width;
          newData[index].endY = newData[index].y + newData[index].height;
        }

        canvasBlockRange.current.minX = Math.min(
          newData[index].startX,
          newData[index].endX
        );
        canvasBlockRange.current.minY = Math.min(
          newData[index].startY,
          newData[index].endY
        );
        canvasBlockRange.current.maxX = Math.max(
          newData[index].startX,
          newData[index].endX
        );
        canvasBlockRange.current.maxY = Math.max(
          newData[index].startY,
          newData[index].endY
        );

        if (newData[index].width === 0 || newData[index].height === 0) {
          newData.pop();
          drawStatus.current = 3;
        } else {
          drawStatus.current = 2;
        }
        drawPoint2(newData);
        return newData;
      });
      tempFlag.current = true;
      setDrawType("");
    } else if (drawStatus.current === 8) {
      setData((preData) => {
        const newData = JSON.parse(JSON.stringify(preData));
        const newItem = newData.find(
          (element) => element.index == chartIndex.current
        );
        if (newItem.type !== "flowline") {
          console.log("change");
          newItem.startX = newItem.x;
          newItem.startY = newItem.y;
          newItem.endX = newItem.x + newItem.width;
          newItem.endY = newItem.y + newItem.height;
        }

        resizeDirection.current = "";
        if (newItem.width === 0 || newItem.height === 0) {
          drawStatus.current = 10;
        } else {
          drawStatus.current = 9;
        }
        drawPoint2(newData);
        return newData;
      });
    }
    needSaveStep.current = true;
  }
  function click(e) {
    // console.log(`click: ${e.target}, ${e.target.nodeName}`);
    // console.log(
    //   "Canvas.js -> click:",
    //   drawStatus.current,
    //   chartIndex.current
    //   // e.target.nodeName
    //   // e.target
    // );

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
    // drawPoint();
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
      // width={screenSize.screenWidth}
      // height={screenSize.screenHeight - canvasPosition.current.y}
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
      {/* <div className="canvasOuter"></div> */}
      {/* <div
        style={{
          position: "absolute",
          top: screenSize.screenHeight - canvasPosition.current.y,
          // top: "10px",
          left: screenSize.screenWidth,
          // ledt: "10px",
          backgroundColor: "#000",
          width: screenSize.screenWidth,
          height: screenSize.screenHeight - canvasPosition.current.y,
        }}
      ></div> */}
      {/* <div className="canvas__svgBg" width="600" height="800"></div> */}
      <svg
        // width={screenSize.screenWidth}
        // height={screenSize.screenHeight - 110}
        // viewBox={`0 0 ${screenSize.screenWidth} ${
        //   screenSize.screenHeight - 110
        // }`}
        className="canvas__svgBg"
        width={600 * newRate}
        height={800 * newRate}
        viewBox={`0 0 ${600 * newRate} ${800 * newRate}`}
        id="svgXXX"
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 畫圖 */}
        <DrawList
          data={data}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          resizeDirection={resizeDirection}
        />
        {/* 點選 */}
        <DrawList
          data={dataSelected.current}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          resizeDirection={resizeDirection}
        />
      </svg>
      {/* <CanvasStyle chartIndex={chartIndex} /> */}
    </div>
  );
};

export default Canvas;
