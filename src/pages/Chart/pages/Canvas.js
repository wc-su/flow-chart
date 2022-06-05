import React, { useRef, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

// import { DataContext, DataSelectedContext, DrawTypeContext } from "../index";
import { DataContext, DrawTypeContext } from "../index";
import DrawList from "../pages/DrawList";

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
}) => {
  const newRate = 100 / canvasRate.current;
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

  const canvasClass = classNames("canvas", {
    crosshair: drawType !== "",
  });
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
    console.log("Canvas.js -> mouse down", drawStatus.current);
    if (![5, 8].includes(drawStatus.current)) {
      drawStatus.current = 0;
    }
    if (drawStatus.current === 0 && drawType) {
      // console.log(
      //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${
      //     e.clientY
      //   }, content X/Y: ${canvasPosition.current.x}, ${canvasPosition.current.y} => ${
      //     e.clientX - canvasPosition.current.x
      //   }, ${e.clientY - canvasPosition.current.y}`
      // );

      drawStatus.current = 1;
      setData((preData) => {
        const x = (e.clientX - canvasPosition.current.x) * newRate;
        const y = (e.clientY - canvasPosition.current.y) * newRate;
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
            fill: "rgb(255, 255, 255)",
            fillOpacity: "0",
            stroke: "rgb(0, 0, 0)",
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
  function mouseMove(e) {
    // console.log(
    //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${e.clientY}`
    // );
    // console.log("mouse move:", drawStatus.current);

    if (drawStatus.current === 1) {
      // console.log("mouse move", chartIndex.current);
      setData((preData) => {
        const newData = JSON.parse(JSON.stringify(preData));
        const index = newData.length - 1;

        let endX = (e.clientX - canvasPosition.current.x) * newRate;
        let endY = (e.clientY - canvasPosition.current.y) * newRate;
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
      let distancsX = (e.clientX - moveInitData.current.mouseStartX) * newRate;
      let distancsY = (e.clientY - moveInitData.current.mouseStartY) * newRate;
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

        let endX = (e.clientX - canvasPosition.current.x) * newRate;
        let endY = (e.clientY - canvasPosition.current.y) * newRate;

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

  return (
    <div
      // width={screenSize.screenWidth}
      // height={screenSize.screenHeight - canvasPosition.current.y}
      ref={canvasRef}
      className={canvasClass}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onClick={click}
    >
      {/* <div className="canvasOuter"></div> */}
      <div
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
      ></div>
      <svg
        // width={screenSize.screenWidth * 3}
        // height={(screenSize.screenHeight - canvasPosition.current.y) * 2}
        // // viewBox={`${screenSize.screenWidth} ${
        // //   screenSize.screenHeight - canvasPosition.current.y
        // // } ${screenSize.screenWidth * newRate} ${
        // //   (screenSize.screenHeight - canvasPosition.current.y) * newRate
        // // }`}
        // viewBox={`${screenSize.screenWidth} ${
        //   screenSize.screenHeight - canvasPosition.current.y
        // } ${screenSize.screenWidth * 3} ${
        //   (screenSize.screenHeight - canvasPosition.current.y) * 2
        // }`}

        // width={svgPos.current.width}
        // height={svgPos.current.height}
        // viewBox={`${-svgPos.current.x} ${-svgPos.current.y} ${
        //   svgPos.current.width * newRate
        // } ${svgPos.current.height * newRate}`}

        width={screenSize.screenWidth}
        height={screenSize.screenHeight - 119}
        viewBox={`0 0 ${screenSize.screenWidth} ${
          screenSize.screenHeight - 119
        }`}
        // width="600"
        // height="800"
        // viewBox="0 0 600 800"
        // style={canvasStyle}
        id="svgXXX"
        ref={svgRef}
        // width="1920"
        // height="1024"
        // viewBox="0 0 1920 1024"
        xmlns="http://www.w3.org/2000/svg"
        data-icon="content"
      >
        {/* 畫圖 */}
        <DrawList
          data={data}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          resizeDirection={resizeDirection}
          test={true}
        />
        {/* 點選 */}
        <DrawList
          data={dataSelected.current}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          resizeDirection={resizeDirection}
          test={false}
        />
      </svg>
    </div>
  );
};

export default Canvas;
