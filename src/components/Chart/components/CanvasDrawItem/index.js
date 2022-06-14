import React, { useRef } from "react";

import Terminal from "./components/Terminal";
import Process from "./components/Process";
import InputOutput from "./components/InputOutput";
import Decision from "./components/Decision";
import Flowline from "./components/Flowline";
import Ellipse from "./components/Ellipse";

const CanvasDrawItem = ({ item, drawStatus, chartIndex, resizeDirection }) => {
  const isItemClicked = useRef(false);

  const gStyle = { cursor: item.cursor, display: item.display };
  if (["start-resize", "end-resize"].includes(item.cursor)) {
    gStyle.cursor = "pointer";
  }

  function mouseDown(e) {
    drawStatus.current = 11;
    isItemClicked.current = true;
    if (item.type !== "ellipse") {
      drawStatus.current = 5;
      chartIndex.current = item.index;
    } else {
      drawStatus.current = 8;
      resizeDirection.current = item.cursor;
    }
  }

  let drawItem;
  switch (item.type) {
    case "terminal":
      drawItem = <Terminal item={item} />;
      break;
    case "process":
      drawItem = <Process item={item} />;
      break;
    case "inputOutput":
      drawItem = <InputOutput item={item} />;
      break;
    case "decision":
      drawItem = <Decision item={item} />;
      break;
    case "flowline":
      drawItem = <Flowline item={item} />;
      break;
    case "ellipse":
      drawItem = <Ellipse item={item} />;
      break;
  }
  return (
    <g style={gStyle} onMouseDown={mouseDown}>
      {drawItem}
    </g>
  );
};

export default CanvasDrawItem;
