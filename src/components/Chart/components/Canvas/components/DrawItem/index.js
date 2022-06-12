import React, { useRef } from "react";

import {
  Terminal,
  Process,
  InputOutput,
  Decision,
  Flowline,
  Ellipse,
} from "./components/*";

const DrawItem = ({
  item,
  canvasPosition,
  drawStatus,
  chartIndex,
  resizeDirection,
}) => {
  const isItemClicked = useRef(false);

  const gStyle = { cursor: item.cursor, display: item.display };
  if (["start-resize", "end-resize"].includes(item.cursor)) {
    gStyle.cursor = "pointer";
  }

  function mouseDown(e) {
    console.log(
      "DrawItem.js -> mouse down:",
      drawStatus.current,
      item.type,
      item.index,
      chartIndex.current
    );
    drawStatus.current = 11;
    isItemClicked.current = true;
    // console.log(
    //   ` -> canvas X/Y: ${canvasPosition.current.x}, ${canvasPosition.current.y}; mouse X/Y: ${e.clientX}, ${e.clientY}; X/Y: ${item.x}, ${item.y}; W/H: ${item.width}, ${item.height}`
    // );
    if (item.type !== "ellipse") {
      drawStatus.current = 5;
      chartIndex.current = item.index;
    } else {
      drawStatus.current = 8;
      resizeDirection.current = item.cursor;
    }
  }
  function mouseMove(e) {
    // console.log(
    //   "DrawItem.js -> mouse move:",
    //   item.type,
    //   isItemClicked.current,
    //   drawStatus.current,
    //   item.index,
    //   item.type
    // );
    if (isItemClicked.current) {
      if (item.type !== "ellipse") {
        if (drawStatus.current === 5) {
          // let distancsX = e.clientX - initStartPosition.current.x;
          // let distancsY = e.clientY - initStartPosition.current.y;
          // // console.log(
          // //   " -> ",
          // //   initItem.current,
          // //   distancsX,
          // //   distancsY
          // // );
          // setData((preData) => {
          //   const newData = JSON.parse(JSON.stringify(preData));
          //   const newItem = newData.find(
          //     (element) => element.index == initItem.current.index
          //   );
          //   newItem.x = initItem.current.x + distancsX;
          //   newItem.y = initItem.current.y + distancsY;
          //   newItem.startX = initItem.current.startX + distancsX;
          //   newItem.startY = initItem.current.startY + distancsY;
          //   newItem.endX = initItem.current.endX + distancsX;
          //   newItem.endY = initItem.current.endY + distancsY;
          //   return newData;
          // });
        }
      } else {
        // if (drawStatus.current === 8) {
        //   drawStatus.current = 9;
        // }
        // if (drawStatus.current === 9) {
        //   // let endX = e.clientX - canvasPosition.current.x;
        //   // let endY = e.clientY - canvasPosition.current.y;
        //   // console.log("kkk", endX, endY);
        //   // setData((preData) => {
        //   //   const newData = JSON.parse(JSON.stringify(preData));
        //   //   const newItem = newData.find(
        //   //     (element) => element.index == initItem.current.index
        //   //   );
        //   //   // console.log(initItem.current.index, newItem, newData, preData);
        //   //   let endX = e.clientX - canvasPosition.current.x;
        //   //   let endY = e.clientY - canvasPosition.current.y;
        //   //   newItem.endX = endX;
        //   //   newItem.endY = endY;
        //   //   if (endX >= newItem.startX) {
        //   //     newItem.width = endX - newItem.x;
        //   //   } else {
        //   //     newItem.width = newItem.startX - endX;
        //   //     newItem.x = endX;
        //   //   }
        //   //   if (endY >= newItem.startY) {
        //   //     newItem.height = endY - newItem.y;
        //   //   } else {
        //   //     newItem.height = newItem.startY - endY;
        //   //     newItem.y = endY;
        //   //   }
        //   //   console.log("yyyy:", newItem);
        //   //   return newData;
        //   // });
        // }
      }
    }
  }
  function mouseUp(e) {
    // console.log(
    //   "DrawItem.js -> mouse up:",
    //   drawStatus.current,
    //   item.type,
    //   item.index
    // );
    // initItem.current = {};
    // initStartPosition.current = {};
    if (item.type !== "ellipse") {
      if (drawStatus.current === 5) {
        drawStatus.current = 0;
      }
    } else {
      // setData((preData) => {
      //   const newData = JSON.parse(JSON.stringify(preData));
      //   const newItem = newData.find((element) => element.index == chartIndex.current);
      //   if (newItem.type !== "flowline") {
      //     newItem.startX = newItem.x;
      //     newItem.startY = newItem.y;
      //     newItem.endX = newItem.x + newItem.width;
      //     newItem.endY = newItem.y + newItem.height;
      //   }
      //   if (newItem.width === 0 || newItem.height === 0) {
      //     newData.pop();
      //   } else {
      //   }
      //   return newData;
      // });
      // drawStatus.current = 0;
    }
    isItemClicked.current = false;
    // console.log(" -> ", isItemClicked.current);
  }
  function click(e) {
    // e.stopPropagation();
    // console.log("DrawItem.js -> click", item.type, item.index);
    // console.log("DrawItem.js -> click", item.index);
    if (item.type !== "ellipse") {
    } else {
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
    <g
      style={gStyle}
      // onClick={click}
      onMouseDown={mouseDown}
      // onMouseMove={mouseMove}
      // onMouseUp={mouseUp}
    >
      {drawItem}
    </g>
  );
};

export default DrawItem;
