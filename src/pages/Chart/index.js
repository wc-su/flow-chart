import React, { useState, useEffect } from "react";

import "./index.scss";
import Toolbar from "./pages/Toolbar";
import Canvas from "./pages/Canvas";

const Chart = () => {
  const [drawType, setDrawType] = useState("");
  // 畫圖
  const [data, setData] = useState([]);
  // 點選
  const [dataSelected, setDataSelected] = useState([]);

  // useEffect(() => {
  //   // console.log("ussEffect data: drawIndex:", drawIndex.current);
  // }, [data]);

  // useEffect(() => {
  //   // console.log("ussEffect drawType:", drawType, drawIndex.current);
  //   // if (drawType) {
  //   // }
  // }, [drawType]);

  return (
    <div className="Chart">
      <Toolbar drawType={drawType} setDrawType={setDrawType} />
      <div className="main">
        <Canvas
          data={data}
          setData={setData}
          dataSelected={dataSelected}
          setDataSelected={setDataSelected}
          drawType={drawType}
          setDrawType={setDrawType}
        />
        <div className="side"></div>
      </div>
    </div>
  );
};

export default Chart;
