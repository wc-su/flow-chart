import React, { useContext, useEffect, createContext } from "react";

// icon
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import {
  IoArrowRedoOutline,
  IoArrowUndoOutline,
  IoChevronDownSharp,
} from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegHandPaper } from "react-icons/fa";

import saveAsPng from "../images/png-file-format-symbol.png";
import saveToDB from "../images/save.png";

import { DrawTypeContext } from "../index";
import ToolbarButton from "./ToolbarButton";

import { UserLoginContext } from "../../../components/Context/UserProvider";

const ActiveButtonContext = createContext();

const Toolbar = ({ canvasRate, chartIndex, activeButton, setActiveButton }) => {
  const { drawType, setDrawType } = useContext(DrawTypeContext);

  const { userLogin, setUserLogin } = useContext(UserLoginContext);

  useEffect(() => {
    // console.log("Toolbar.js -> useEffect drawType", drawType, activeButton);
    if (!drawType && activeButton) {
      setActiveButton({});
    }
  }, [drawType]);

  function click(e) {
    // console.log(e.target.nodeName);
    setActiveButton((preData) =>
      preData.purpose || preData.feature ? {} : preData
    );
    setDrawType("");
  }

  return (
    <div className="toolbar" onClick={click}>
      <ActiveButtonContext.Provider
        value={{ activeButton: activeButton, setActiveButton: setActiveButton }}
      >
        {/* {drawType} */}
        <div className="toolbar__group">
          {/* <ToolbarButton purpose="canvasRate" feature="percent">
            {canvasRate.current} % <IoChevronDownSharp />
          </ToolbarButton>
          <div className="separator"></div>
          <div className="toolbar__group">
            <ToolbarButton
              purpose="canvasRate"
              feature="zoomIn"
              canvasRate={canvasRate}
            >
              <AiOutlineZoomIn className="react-icon" />
            </ToolbarButton>
            <ToolbarButton
              purpose="canvasRate"
              feature="zoomOut"
              canvasRate={canvasRate}
            >
              <AiOutlineZoomOut className="react-icon" />
            </ToolbarButton>
          </div>
          <div className="separator"></div> */}
          <ToolbarButton purpose="saveFile" feature="png">
            <img className="toolbar__img" src={saveAsPng} alt="saveAsPng"></img>
          </ToolbarButton>
          {/* <div className="separator"></div>
          <ToolbarButton purpose="move" feature="move">
            <FaRegHandPaper className="react-icon" />
          </ToolbarButton> */}
        </div>
        {/* <div className="separator"></div> */}
        <div className="toolbar__group">
          <ToolbarButton purpose="draw" feature="terminal">
            <svg
              className="svg"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              xmlns="http://www.w3.org/2000/svg"
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
          </ToolbarButton>
          <ToolbarButton purpose="draw" feature="process">
            <svg
              className="svg"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              xmlns="http://www.w3.org/2000/svg"
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
          </ToolbarButton>
          <ToolbarButton purpose="draw" feature="inputOutput">
            <svg
              className="svg"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              xmlns="http://www.w3.org/2000/svg"
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
          </ToolbarButton>
          <ToolbarButton purpose="draw" feature="decision">
            <svg
              className="svg"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              xmlns="http://www.w3.org/2000/svg"
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
          </ToolbarButton>
          <ToolbarButton purpose="draw" feature="flowline">
            <svg
              className="svg"
              width="32"
              height="30"
              viewBox="0 0 32 30"
              xmlns="http://www.w3.org/2000/svg"
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
          </ToolbarButton>
          <div className="separator"></div>
          <ToolbarButton
            purpose="figure"
            feature="delete"
            chartIndex={chartIndex}
          >
            <RiDeleteBin6Line className="react-icon" />
          </ToolbarButton>
          <div className="separator"></div>
          <div className="toolbar__group">
            <ToolbarButton purpose="step" feature="undo">
              <IoArrowUndoOutline className="react-icon" />
            </ToolbarButton>
            <ToolbarButton purpose="step" feature="redo">
              <IoArrowRedoOutline className="react-icon" />
            </ToolbarButton>
          </div>
          <div className="separator"></div>
          <div className="toolbar__group">
            <ToolbarButton
              purpose="save"
              feature="database"
              disabled={userLogin ? false : true}
            >
              <img className="toolbar__img" src={saveToDB} alt="saveToDB"></img>
            </ToolbarButton>
          </div>
        </div>
      </ActiveButtonContext.Provider>
    </div>
  );
};

export default Toolbar;
export { ActiveButtonContext };
