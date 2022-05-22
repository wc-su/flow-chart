import React, { useRef, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

import { DataContext, DataSelectedContext, DrawTypeContext } from "../index";
import DrawList from "../pages/DrawList";

const Canvas = () => {
  // 取得畫布的起始座標
  const canvasRef = useRef();
  const canvasPosition = useRef({});

  // 狀態：
  // 0: 初始
  // 1: 畫圖、 2: 畫圖結束、3: 畫圖錯誤
  // 5: 移動、 7: 移動結束
  // 8: 調整開始、9: 調整、10: 調整結束
  const drawStatus = useRef(0);
  const chartIndex = useRef(-1);
  const moveInitData = useRef();

  const { data, setData } = useContext(DataContext);
  const { dataSelected, setDataSelected } = useContext(DataSelectedContext);
  const { drawType, setDrawType } = useContext(DrawTypeContext);

  const canvasClass = classNames("canvas", {
    crosshair: drawType !== "",
  });

  useEffect(() => {
    // console.log("Canvas.js -> useEffect canvasRef:", canvasRef);
    if (canvasRef) {
      canvasPosition.current = canvasRef.current.getBoundingClientRect();
      // console.log("->", canvasPosition.current);
    }
  }, [canvasRef]);

  useEffect(() => {
    // console.log(
    //   "Canvas.js -> ussEffect data:",
    //   drawStatus.current,
    //   data.length,
    //   data.length > 0 ? data[data.length - 1].index : -1
    // );
    if (drawStatus.current === 2) {
      // drawPoint();
    } else if (drawStatus.current === 5) {
      drawPoint();
    } else if (drawStatus.current === 9) {
      drawPoint();
    }
  }, [data]);

  function mouseDown(e) {
    console.log("Canvas.js -> mouse down", drawStatus.current);
    if (drawStatus.current === 0 && drawType) {
      // console.log(
      //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${
      //     e.clientY
      //   }, content X/Y: ${canvasPosition.current.x}, ${canvasPosition.current.y} => ${
      //     e.clientX - canvasPosition.current.x
      //   }, ${e.clientY - canvasPosition.current.y}`
      // );

      drawStatus.current = 1;
      console.log(" -> change", drawStatus.current, chartIndex.current);
      setData((preData) => {
        const x = e.clientX - canvasPosition.current.x;
        const y = e.clientY - canvasPosition.current.y;
        const newData = [
          ...preData,
          // JSON.parse(JSON.stringify(preData)),
          {
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
          },
        ];

        return newData;
      });
    } else if (drawStatus.current === 5) {
      drawPoint();
      moveInitData.current = {
        item: JSON.parse(
          JSON.stringify(data.find((element) => element.index === chartIndex.current))
        ),
        mouseStartX: e.clientX,
        mouseStartY: e.clientY,
      };
      // console.log(moveInitData);
    }
  }
  function mouseMove(e) {
    // console.log(
    //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${e.clientY}`
    // );
    // console.log("mouse move:", drawStatus.current);

    // if (drawStatus.current === 1) {
    //   drawStatus.current = 2;
    // }
    if (drawStatus.current === 1) {
      // console.log("mouse move", chartIndex.current);
      setData((preData) => {
        // const newData = [...preData];
        const newData = JSON.parse(JSON.stringify(preData));
        const index = newData.length - 1;
        // const index = chartIndex.current;
        // console.log("mmm", index, newData);
        let endX = e.clientX - canvasPosition.current.x;
        let endY = e.clientY - canvasPosition.current.y;
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
        return newData;
      });
    } else if (drawStatus.current === 5) {
      let distancsX = e.clientX - moveInitData.current.mouseStartX;
      let distancsY = e.clientY - moveInitData.current.mouseStartY;
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
        return newData;
      });
    } else if (drawStatus.current === 9) {
      setData((preData) => {
        const newData = JSON.parse(JSON.stringify(preData));
        const newItem = newData.find((element) => element.index == chartIndex.current);
        let endX = e.clientX - canvasPosition.current.x;
        let endY = e.clientY - canvasPosition.current.y;

        newItem.endX = endX;
        newItem.endY = endY;
        if (endX >= newItem.startX) {
          newItem.width = endX - newItem.x;
        } else {
          newItem.width = newItem.startX - endX;
          newItem.x = endX;
        }
        if (endY >= newItem.startY) {
          newItem.height = endY - newItem.y;
        } else {
          newItem.height = newItem.startY - endY;
          newItem.y = endY;
        }
        return newData;
      });
    }
  }
  function mouseUp(e) {
    console.log(
      "Canvas.js -> mouse up",
      drawStatus.current,
      chartIndex.current,
      drawType
    );
    if (drawStatus.current === 1) {
      setData((preData) => {
        // const newData = [...preData];
        const newData = JSON.parse(JSON.stringify(preData));
        const index = newData.length - 1;
        // console.log("uuu", index, newData);
        // console.log("uuu2", newData[index].x);
        if (!(drawType === "flowline")) {
          // console.log("change");
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
        // console.log(`uuu: ${newData}`);
        // console.log(newData);
        return newData;
      });

      setDrawType("");
    }
  }
  function click(e) {
    // console.log(`click: ${e.target}, ${e.target.nodeName}`);
    console.log(
      "Canvas.js -> click:",
      drawStatus.current,
      chartIndex.current
      // e.target.nodeName
      // e.target
    );
    // setPointArea();

    if (drawStatus.current === 2) {
      chartIndex.current = data[data.length - 1].index;
      drawPoint();
      drawStatus.current = 0;
    } else if (drawStatus.current === 3) {
      chartIndex.current = -1;
      drawPoint();
      drawStatus.current = 0;
    } else if (drawStatus.current === 0) {
      chartIndex.current = -1;
      drawPoint();
    }
  }

  function drawPoint() {
    setDataSelected((preData) => {
      if (chartIndex.current !== -1) {
        console.log("xxxx", chartIndex.current, data);
        const originData = JSON.parse(
          JSON.stringify(data.find((item) => item.index === chartIndex.current))
        );
        if (originData.type === "flowline") {
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

        originData.type = "process";
        originData.decorate.stroke = "#00a8ff";
        originData.decorate.strokeDasharray = "3";
        originData.pointerEvents = "none";

        const newData = [];
        newData.push(originData);

        const pointWidth = initPoint.width;
        const pointHeight = initPoint.height;
        initPoint.decorate.fill = "#00a8ff";
        initPoint.decorate.stroke = "none";
        initPoint.type = "ellipse";

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
        // if (drawStatus.current !== 6) {
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
          newData[i].width = 4;
          newData[i].height = 4;
          // }
        }
        return newData;
      } else {
        return preData.length > 0 ? [] : preData;
      }
    });
  }

  return (
    <div
      ref={canvasRef}
      className={canvasClass}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onClick={click}
    >
      <svg
        className="svg"
        width="1920"
        height="1024"
        viewBox="0 0 1920 1024"
        xmlns="http://www.w3.org/2000/svg"
        data-icon="content"
      >
        {/* 畫圖 */}
        <DrawList
          data={data}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          test={true}
        />
        {/* 點選 */}
        <DrawList
          data={dataSelected}
          canvasPosition={canvasPosition}
          drawStatus={drawStatus}
          chartIndex={chartIndex}
          test={false}
        />
      </svg>
    </div>
  );
};

export default Canvas;
