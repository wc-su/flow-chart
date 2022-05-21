import React from "react";

import Terminal from "../components/Terminal";
import Process from "../components/Process";
import InputOutput from "../components/InputOutput";
import Decision from "../components/Decision";
import Flowline from "../components/Flowline";
import Ellipse from "../components/Ellipse";

const DrawItem = ({ item, drawItemClick, setDrawIndex }) => {
  // console.log("DrawItem.js", item);

  const gStyle = { cursor: item.cursor };

  // const [decorate, setDecorate] = useState({
  //   fill: "rgb(255, 255, 255)",
  //   fillOpacity: "0",
  //   stroke: "rgb(0, 0, 0)",
  //   strokeWidth: "1.3",
  //   strokeMiterlimit: 10,
  //   strokeDasharray: "0",
  // });

  // const { x, y, width, height, type, startX, startY, endX, endY } = item;
  // console.log("array:", item);
  // console.log("array:", x, y, width, height, type, startX, startY, endX, endY);

  function mouseDown(e) {
    console.log("DrawItem.js -> mouse down", item.index, item.type, e.target);
    if(item.type === "ellipse") {

    }
  }
  function click(e) {
    console.log("DrawItem.js -> click", item.index, item.type, e.target);
    // console.log("DrawItem.js -> click", item.index);
    drawItemClick.current = true;
    if(item.type !== "ellipse") {
      setDrawIndex(item.index);
    }
  }

  let drawItem;
  switch (item.type) {
    case "terminal":
      drawItem = (
        <Terminal item={item} />
        // <Terminal item={item} decorate={decorate} selected={selected} />
      );
      break;
    case "process":
      drawItem = (
        <Process item={item} />
        // <Process item={item} decorate={decorate} selected={selected} />
      );
      break;
    case "inputOutput":
      drawItem = (
        <InputOutput item={item} />
        // <InputOutput item={item} decorate={decorate} selected={selected} />
      );
      break;
    case "decision":
      drawItem = (
        <Decision item={item} />
        // <Decision item={item} decorate={decorate} selected={selected} />
      );
      break;
    case "flowline":
      drawItem = (
        <Flowline item={item} />
        // <Flowline item={item} decorate={decorate} selected={selected} />
      );
      break;
    case "ellipse":
      drawItem = <Ellipse item={item} />;
      break;
  }
  return (
    <g style={gStyle} onClick={click} onMouseDown={mouseDown}>
      {drawItem}
    </g>
  );
};

export default DrawItem;
