import React, { useState, createContext } from "react";

import "./index.scss";
import Toolbar from "./pages/Toolbar";
import Canvas from "./pages/Canvas";

const DataContext = createContext();
const DataSelectedContext = createContext();
const DrawTypeContext = createContext();

const Chart = () => {
  const [drawType, setDrawType] = useState("");
  // 畫圖
  const [data, setData] = useState([]);
  // 點選
  const [dataSelected, setDataSelected] = useState([]);

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
            <Toolbar />
            <div className="main">
              <Canvas />
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
