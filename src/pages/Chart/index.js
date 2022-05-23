import React, { useState, useRef, useEffect, createContext } from "react";
import { v4 as uuidv4 } from "uuid";

import "./index.scss";
import Toolbar from "./pages/Toolbar";
import Canvas from "./pages/Canvas";

const DataContext = createContext();
const DataSelectedContext = createContext();
const DrawTypeContext = createContext();

const Chart = () => {
  const chartIndex = useRef(-1);
  const resizeDirection = useRef("");
  const tempFlag = useRef(false);

  const [drawType, setDrawType] = useState("");
  const [activeButton, setActiveButton] = useState({});
  // 畫圖
  const [data, setData] = useState([]);
  // 點選
  const [dataSelected, setDataSelected] = useState([]);

  useEffect(() => {
    // console.log("qqq", activeButton, chartIndex.current);
    if (activeButton && Object.keys(activeButton).length !== 0) {
      if (
        activeButton.purpose === "figure" &&
        activeButton.feature === "delete" &&
        chartIndex.current !== -1
      ) {
        tempFlag.current = true;
        setData((preData) => {
          return preData.filter((item) => item.index !== chartIndex.current);
        });
      }
    }
  }, [activeButton]);

  useEffect(() => {
    if (tempFlag.current) {
      chartIndex.current = -1;
      drawPoint();
      tempFlag.current = false;
      setActiveButton({});
    }
  }, [data]);

  function drawPoint() {
    setDataSelected((preData) => {
      // console.log("wwwww", chartIndex.current);
      if (chartIndex.current !== -1) {
        // console.log("xxxx", chartIndex.current, data);
        const originData = JSON.parse(
          JSON.stringify(data.find((item) => item.index === chartIndex.current))
        );
        // if (originData.type === "flowline") {
        // console.log(
        //   "111:",
        //   data.find((item) => item.index === chartIndex.current)
        // );
        const newStartX = Math.min(originData.startX, originData.endX);
        const newStartY = Math.min(originData.startY, originData.endY);
        const newEndX = Math.max(originData.startY, originData.endY);
        const newEndY = Math.max(originData.startY, originData.endY);
        // console.log("222:", originData);
        originData.startX = newStartX;
        originData.startY = newStartY;
        originData.x = newStartX;
        originData.y = newStartY;
        originData.endX = newEndX;
        originData.endY = newEndY;
        // console.log("333:", originData);
        // console.log("");
        // }
        const initPoint = JSON.parse(JSON.stringify(originData));

        originData.type = "process";
        originData.decorate.stroke = "#00a8ff";
        originData.decorate.strokeDasharray = "3";
        originData.pointerEvents = "none";

        const newData = [];
        if (resizeDirection.current !== "") {
          originData.display = "none";
        }
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
          if (resizeDirection.current !== "") {
            newData[i].display =
              pointConfig[i - 1].cursor === resizeDirection.current
                ? "block"
                : "none";
          }
        }
        return newData;
      } else {
        return preData.length > 0 ? [] : preData;
      }
    });
  }

  return (
    <div className="Chart">
      <DataContext.Provider value={{ data: data, setData: setData }}>
        <DataSelectedContext.Provider
          value={{
            dataSelected: dataSelected,
            setDataSelected: setDataSelected,
          }}
        >
          <DrawTypeContext.Provider
            value={{ drawType: drawType, setDrawType: setDrawType }}
          >
            <Toolbar
              chartIndex={chartIndex}
              activeButton={activeButton}
              setActiveButton={setActiveButton}
            />
            <div className="main">
              <Canvas
                chartIndex={chartIndex}
                drawPoint={drawPoint}
                resizeDirection={resizeDirection}
              />
              {/* <div className="side"></div> */}
            </div>
          </DrawTypeContext.Provider>
        </DataSelectedContext.Provider>
      </DataContext.Provider>
    </div>
  );
};

export default Chart;
export { DataContext, DataSelectedContext, DrawTypeContext };

// Chart ( index.js )
//    |----------------
//    |               |
// Toolbar          main
//    |               |----------
// ToolbarButton      |         |
//                 Canvas      side
//                    |
//                DrawList
//                    |
//                DrawItem
