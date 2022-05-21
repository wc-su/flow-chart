import React from "react";

// icon
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import {
  IoArrowRedoOutline,
  IoArrowUndoOutline,
  IoChevronDownSharp,
} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

const Toolbar = ({ drawType, setDrawType }) => {
  function toolHandle(e) {
    console.log(e.target.nodeName);
    if (e.target.nodeName != "DIV") {
      // console.log(e.target.nodeName, e.target);
      let element = e.target;
      if (e.target.nodeName != "svg") {
        element = e.target.parentElement;
      }
      // console.log(element.getAttribute("data-icon"));

      const type = element.getAttribute("data-draw");
      if (type) {
        setDrawType(type);
      } else {
        setDrawType("");
      }
    }
  }

  function mouseOver(e) {
    // console.log(e.target.nodeName, e.target);
    if (e.target.nodeName != "DIV") {
      let element = e.target;
      if (e.target.nodeName != "svg") {
        element = e.target.parentElement;
      }
      // console.log(element.getAttribute("data-icon"));

      // const type = element.getAttribute("data-draw");
      // if (type) {
      //   setDrawType(type);
      // } else {
      //   setDrawType("");
      // }
    }
  }

  return (
    <div className="toolbar" onClick={toolHandle} onMouseOver={mouseOver}>
      {drawType}
      <div className="toolbar__group">
        <div>
          100%
          <IoChevronDownSharp data-icon="down" />
        </div>
        <div className="separator"></div>
        <div className="toolbar__group">
          <div>
            <AiOutlineZoomIn className="react-icon" data-icon="zoomIn" />
          </div>
          <div>
            <AiOutlineZoomOut className="react-icon" data-icon="zoomOut" />
          </div>
        </div>
      </div>
      <div className="drawFigure toolbar__group">
        <div>
          <svg
            className="svg"
            width="32"
            height="30"
            viewBox="0 0 32 30"
            xmlns="http://www.w3.org/2000/svg"
            data-icon="terminal"
            data-draw="terminal"
          >
            <rect
              x="1.44"
              y="7.68"
              width="28.8"
              height="14.4"
              rx="5"
              ry="5"
              fill="rgb(255, 255, 255)"
              stroke="rgb(0, 0, 0)"
              strokeWidth="1"
              pointerEvents="all"
            ></rect>
          </svg>
        </div>
        <div>
          <svg
            className="svg"
            width="32"
            height="30"
            viewBox="0 0 32 30"
            xmlns="http://www.w3.org/2000/svg"
            data-icon="process"
            data-draw="process"
          >
            <rect
              x="1.44"
              y="7.68"
              width="28.8"
              height="14.4"
              fill="rgb(255, 255, 255)"
              stroke="rgb(0, 0, 0)"
              strokeWidth="1.3"
              pointerEvents="all"
            ></rect>
          </svg>
        </div>
        <div>
          <svg
            className="svg"
            width="32"
            height="30"
            viewBox="0 0 32 30"
            xmlns="http://www.w3.org/2000/svg"
            data-icon="inputOutput"
            data-draw="inputOutput"
          >
            <path
              d="M 1.44 22.08 L 6.24 7.68 L 30.24 7.68 L 25.44 22.08 Z"
              fill="rgb(255, 255, 255)"
              stroke="rgb(0, 0, 0)"
              strokeWidth="1.3"
              strokeMiterlimit="10"
              pointerEvents="all"
            ></path>
          </svg>
        </div>
        <div>
          <svg
            className="svg"
            width="32"
            height="30"
            viewBox="0 0 32 30"
            xmlns="http://www.w3.org/2000/svg"
            data-icon="decision"
            data-draw="decision"
          >
            <path
              d="M 15.98 1.36 L 29.58 14.96 L 15.98 28.56 L 2.38 14.96 Z"
              fill="rgb(255, 255, 255)"
              stroke="rgb(0, 0, 0)"
              strokeWidth="1.3"
              strokeMiterlimit="10"
              pointerEvents="all"
            ></path>
          </svg>
        </div>
        <div>
          <svg
            className="svg"
            width="32"
            height="30"
            viewBox="0 0 32 30"
            xmlns="http://www.w3.org/2000/svg"
            data-icon="flowline"
            data-draw="flowline"
          >
            <path
              d="M 5.04 25.2 L 24.15 6.09"
              fill="none"
              stroke="white"
              strokeWidth="9.3"
              strokeMiterlimit="10"
              pointerEvents="stroke"
              visibility="hidden"
            ></path>
            <path
              d="M 5.04 25.2 L 24.15 6.09"
              fill="none"
              stroke="rgb(0, 0, 0)"
              strokeWidth="1.3"
              strokeMiterlimit="10"
              pointerEvents="stroke"
            ></path>
            <path
              d="M 25.71 4.53 L 24.67 7.65 L 24.15 6.09 L 22.59 5.57 Z"
              fill="rgb(0, 0, 0)"
              stroke="rgb(0, 0, 0)"
              strokeWidth="1.3"
              strokeMiterlimit="10"
              pointerEvents="all"
            ></path>
          </svg>
        </div>
        <div className="separator"></div>
        <div>
          <RiDeleteBin6Line className="react-icon" data-icon="delete" />
        </div>
        <div className="separator"></div>
        <div className="toolbar__group">
          <div>
            <IoArrowUndoOutline className="react-icon" data-icon="undo" />
          </div>
          <div>
            <IoArrowRedoOutline className="react-icon" data-icon="redo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
