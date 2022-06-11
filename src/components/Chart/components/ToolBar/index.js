import React, { useContext, useEffect, useState, useRef } from "react";

import "./index.scss";

import { DrawTypeContext } from "../../index";
import ToolItem from "./components/ToolItem";

import { UserLoginContext } from "../../../../context/UserProvider";

import saveAsJPG from "./images/save-as-jpg.png";
import saveAsPNG from "./images/save-as-png.png";
import upload from "./images/upload.png";
import deleteDiagram from "./images/delete.png";
import nextStep from "./images/next-step.png";
import backStep from "./images/back-step.png";
import iconFlowline from "./images/flowline.png";
import iconInputOutput from "./images/inputOutput.png";
import iconProcess from "./images/process.png";
import iconTerminal from "./images/terminal.png";
import iconDecision from "./images/decision.png";
import iconZoomin from "./images/zoom-in.png";
import iconZoomout from "./images/zoom-out.png";
import iconMove from "./images/canvas-move.png";

const ActiveButtonContext = React.createContext();

const Toolbar = ({
  canvasRate,
  chartIndex,
  activeButton,
  setActiveButton,
  toolBarPop,
  setToolBarPop,
}) => {
  const [drawSelected, setDrawSelected] = useState(0);
  const [saveSelected, setSaveSelected] = useState(0);

  const { drawType, setDrawType } = useContext(DrawTypeContext);
  const { userLogin, setUserLogin } = useContext(UserLoginContext);

  function click(e) {
    setActiveButton((preData) =>
      preData.purpose || preData.feature ? {} : preData
    );
    setDrawType("");
    setToolBarPop("");
  }

  const itemImg = {
    move: {
      selected: 0,
      info: [{ feature: "move", imgUrl: iconMove, text: "move" }],
    },
    saveFile: {
      selected: saveSelected,
      info: [
        { feature: "png", imgUrl: saveAsPNG, text: "png" },
        { feature: "jpg", imgUrl: saveAsJPG, text: "jpg" },
      ],
    },
    percent: {
      selected: 0,
      info: [{ feature: "percent", imgUrl: null, text: "percent" }],
    },
    zoomIn: {
      selected: 0,
      info: [{ feature: "zoomIn", imgUrl: iconZoomin, text: "zoomIn" }],
    },
    zoomOut: {
      selected: 0,
      info: [{ feature: "zoomOut", imgUrl: iconZoomout, text: "zoomOut" }],
    },
    draw: {
      selected: drawSelected,
      info: [
        { feature: "terminal", imgUrl: iconTerminal, text: "terminal" },
        { feature: "process", imgUrl: iconProcess, text: "process" },
        {
          feature: "inputOutput",
          imgUrl: iconInputOutput,
          text: "inputOutput",
        },
        { feature: "decision", imgUrl: iconDecision, text: "decision" },
        { feature: "flowline", imgUrl: iconFlowline, text: "flowline" },
      ],
    },
    figure: {
      selected: 0,
      info: [{ feature: "delete", imgUrl: deleteDiagram, text: "delete" }],
    },
    undo: {
      selected: 0,
      info: [{ feature: "undo", imgUrl: backStep, text: "undo" }],
    },
    redo: {
      selected: 0,
      info: [{ feature: "redo", imgUrl: nextStep, text: "redo" }],
    },
    save: {
      selected: 0,
      info: [{ feature: "database", imgUrl: upload, text: "database" }],
    },
  };

  return (
    <div className="toolList" onClick={click}>
      <ActiveButtonContext.Provider
        value={{
          activeButton: activeButton,
          setActiveButton: setActiveButton,
          toolBarPop: toolBarPop,
          setToolBarPop: setToolBarPop,
        }}
      >
        <ToolItem
          purpose="canvasRate"
          data={itemImg["percent"]}
          disabled={true}
        >
          <p className="percent">{canvasRate.current} %</p>
        </ToolItem>
        <ToolItem
          purpose="canvasRate"
          data={itemImg["zoomIn"]}
          disabled={canvasRate.current >= 2000}
        ></ToolItem>
        <ToolItem
          purpose="canvasRate"
          data={itemImg["zoomOut"]}
          disabled={canvasRate.current <= 50}
        ></ToolItem>
        <div className="toolList__separator"></div>
        <ToolItem
          purpose="move"
          data={itemImg["move"]}
          // disabled={true}
        ></ToolItem>
        <div className="toolList__separator"></div>
        <ToolItem
          purpose="draw"
          data={itemImg["draw"]}
          changeSelected={setDrawSelected}
        ></ToolItem>
        <div className="toolList__separator"></div>
        <ToolItem purpose="figure" data={itemImg["figure"]}></ToolItem>
        <div className="toolList__separator"></div>
        <ToolItem purpose="step" data={itemImg["undo"]}></ToolItem>
        <ToolItem purpose="step" data={itemImg["redo"]}></ToolItem>
        <div className="toolList__separator"></div>
        <ToolItem
          purpose="save"
          data={itemImg["save"]}
          disabled={userLogin ? false : true}
        ></ToolItem>
        <div className="toolList__separator"></div>
        <ToolItem
          purpose="saveFile"
          data={itemImg["saveFile"]}
          changeSelected={setSaveSelected}
        ></ToolItem>
      </ActiveButtonContext.Provider>
    </div>
  );
};

export default Toolbar;
export { ActiveButtonContext };
