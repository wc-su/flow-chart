import React, { useContext, useEffect, useState, useRef } from "react";

import "./index.scss";

import { DrawTypeContext } from "../../index";
import ToolItem from "./components/ToolItem";

import { UserLoginContext } from "../../../../context/UserProvider";

import saveAsJPG from "../../images/save-as-jpg.png";
import saveAsPNG from "../../images/save-as-png.png";
import upload from "../../images/upload.png";
import deleteDiagram from "../../images/delete.png";
import nextStep from "../../images/next-step.png";
import backStep from "../../images/back-step.png";
import iconFlowline from "../../images/flowline.png";
import iconInputOutput from "../../images/inputOutput.png";
import iconProcess from "../../images/process.png";
import iconTerminal from "../../images/terminal.png";
import iconDecision from "../../images/decision.png";
import iconZoomin from "../../images/zoom-in.png";
import iconZoomout from "../../images/zoom-out.png";
import iconMove from "../../images/canvas-move.png";

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

  useEffect(() => {
    // console.log("Toolbar.js -> useEffect drawType", drawType, activeButton);
    // if (!drawType && Object.keys(activeButton).length > 0) {
    //   setActiveButton({});
    // }
  }, [drawType]);

  useEffect(() => {
    // console.log(
    //   "Toolbar.js -> useEffect drawSelected:",
    //   drawSelected
    //   // itemImg.draw.info[drawSelected]
    // );
    // setActiveButton(() => ({
    //   purpose: "draw",
    //   feature: itemImg.draw.info[drawSelected].feature,
    // }));
  }, [drawSelected]);

  useEffect(() => {
    // console.log(
    //   "Toolbar.js -> useEffect saveSelected:",
    //   saveSelected,
    //   // itemImg.saveFile.info[saveSelected]
    // );
    // setActiveButton(() => ({
    //   purpose: "saveFile",
    //   feature: itemImg.saveFile.info[saveSelected].feature,
    // }));
  }, [saveSelected]);

  function click(e) {
    // console.log("Toolbar click", e.target.nodeName);
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
          <p>{canvasRate.current} %</p>
        </ToolItem>
        <ToolItem
          purpose="canvasRate"
          data={itemImg["zoomIn"]}
          disabled={true}
        ></ToolItem>
        <ToolItem
          purpose="canvasRate"
          data={itemImg["zoomOut"]}
          disabled={true}
        ></ToolItem>
        <ToolItem
          purpose="move"
          data={itemImg["move"]}
          disabled={true}
        ></ToolItem>
        <ToolItem
          purpose="draw"
          data={itemImg["draw"]}
          changeSelected={setDrawSelected}
        ></ToolItem>
        <ToolItem purpose="figure" data={itemImg["figure"]}></ToolItem>
        <ToolItem purpose="step" data={itemImg["undo"]}></ToolItem>
        <ToolItem purpose="step" data={itemImg["redo"]}></ToolItem>
        <ToolItem
          purpose="saveFile"
          data={itemImg["saveFile"]}
          changeSelected={setSaveSelected}
        ></ToolItem>
        <ToolItem
          purpose="save"
          data={itemImg["save"]}
          disabled={userLogin ? false : true}
        ></ToolItem>
      </ActiveButtonContext.Provider>
    </div>
  );
};

export default Toolbar;
export { ActiveButtonContext };
