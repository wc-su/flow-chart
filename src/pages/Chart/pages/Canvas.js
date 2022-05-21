import React, { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

import DrawList from "../pages/DrawList";

const Canvas = ({
  data,
  setData,
  dataSelected,
  setDataSelected,
  drawType,
  setDrawType,
}) => {
  const drawItemClick = useRef(false);
  // 狀態：0: 初始、1: 畫圖開始、2: 畫圖結束、9: 畫圖錯誤
  const drawStatus = useRef(0);
  const [drawIndex, setDrawIndex] = useState(-1);

  const canvasClass = classNames("canvas", {
    crosshair: drawType !== "",
  });

  useEffect(() => {
    console.log("Canvas.js -> useEffect drawIndex:", drawIndex);
    setDataSelected((preData) => {
      const newData = [];
      if (drawIndex !== -1) {
        const originData = JSON.parse(
          JSON.stringify(data.find((item) => item.index === drawIndex))
        );
        const initPoint = JSON.parse(JSON.stringify(originData));

        originData.type = "process";
        originData.decorate.stroke = "#00a8ff";
        originData.decorate.strokeDasharray = "3";
        originData.pointerEvents = "none";

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
        }
      }
      return newData;
      // return preData;
    });
  }, [drawIndex]);

  useEffect(() => {
    // if (drawStatus.current === 1 || drawStatus.current === 2) {
    if (drawStatus.current === 2) {
      console.log(
        "Canvas.js -> ussEffect data:",
        data.length,
        data[data.length - 1].index
      );
      console.log(data);
      drawStatus.current = 0;
      console.log("before", drawIndex);
      setDrawIndex(data[data.length - 1].index);
      console.log("after", drawIndex);
    } else if (drawStatus.current === 9) {
      drawStatus.current = 0;
      console.log("before", drawIndex);
      setDrawIndex(-1);
      console.log("after", drawIndex);
    }
  }, [data]);

  function mouseDown(e) {
    // console.log("mouse down", (drawStatus.current) ? true : false);
    if (!drawStatus.current && drawType) {
      console.log("mouse down", drawStatus.current, drawIndex);
      // 取得畫布的起始座標
      const content = document.querySelector(".canvas");
      const position = content.getBoundingClientRect();
      // console.log(
      //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${
      //     e.clientY
      //   }, content X/Y: ${position.x}, ${position.y} => ${
      //     e.clientX - position.x
      //   }, ${e.clientY - position.y}`
      // );

      drawStatus.current = 1;
      console.log(" -> change", drawStatus.current, drawIndex);
      setData((preData) => {
        const x = e.clientX - position.x;
        const y = e.clientY - position.y;
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
            pointerEvents: "all"
          },
        ];

        return newData;
      });
    }
  }
  function mouseMove(e) {
    // console.log(
    //   `Screen X/Y: ${e.screenX}, ${e.screenY}, Client X/Y: ${e.clientX}, ${e.clientY}`
    // );
    // console.log("mouse move:", drawStatus.current);
    if (drawStatus.current === 1) {
      // console.log("mouse move", drawIndex);
      // 取得畫布的起始座標
      const content = document.querySelector(".canvas");
      const position = content.getBoundingClientRect();

      setData((preData) => {
        const newData = [...preData];
        // const newData = JSON.parse(JSON.stringify(preData));
        const index = newData.length - 1;
        // const index = drawIndex;
        // console.log("mmm", index, newData);
        let endX = e.clientX - position.x;
        let endY = e.clientY - position.y;
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
    }
  }
  function mouseUp(e) {
    if (drawStatus.current === 1) {
      console.log(
        "mouse up",
        drawIndex,
        drawType
        // typeof drawType
      );
      setData((preData) => {
        const newData = [...preData];
        // const newData = JSON.parse(JSON.stringify(preData));
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
          drawStatus.current = 9;
          // setDrawIndex(-1);
        } else {
          drawStatus.current = 2;
          // setDrawIndex(index);
        }
        // console.log(`uuu: ${newData}`);
        // console.log(newData);
        return newData;
      });

      setDrawType("");
      drawItemClick.current = true;
    }
  }
  function click(e) {
    // console.log(`click: ${e.target}, ${e.target.nodeName}`);
    console.log(
      "Canvas.js -> click:",
      drawItemClick.current,
      drawIndex,
      e.target.nodeName
      // e.target
    );
    // setPointArea();
    if (drawItemClick.current) {
      drawItemClick.current = false;
    } else {
      setDrawIndex(-1);
    }
  }

  return (
    <div
      className={canvasClass}
      onMouseDown={mouseDown}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onClick={click}
    >
      <svg
        className="svg"
        width="500"
        height="500"
        viewBox="0 0 500 500"
        xmlns="http://www.w3.org/2000/svg"
        data-icon="content"
      >
        {/* 畫圖 */}
        <DrawList
          data={data}
          drawItemClick={drawItemClick}
          setDrawIndex={setDrawIndex}
        />
        {/* 點選 */}
        <DrawList
          data={dataSelected}
          drawItemClick={drawItemClick}
          setDrawIndex={setDrawIndex}
        />
      </svg>
    </div>
  );
};

export default Canvas;
