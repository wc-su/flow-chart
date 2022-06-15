import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";

import "./index.scss";
import CanvasToolItem from "../CanvasToolItem";
import { DrawTypeContext } from "../../index";

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
import iconBackFiles from "../../images/back-files.png";

const ActiveButtonContext = React.createContext();

const CanvasToolBar = ({
  canvasRate,
  activeButton,
  setActiveButton,
  toolBarPop,
  setToolBarPop,
  docTitle,
  firstInitTitle,
}) => {
  const userLogin = useSelector((state) => state.userLogin);

  const [drawSelected, setDrawSelected] = useState(0);
  const [saveSelected, setSaveSelected] = useState(0);
  const [title, setTitle] = useState("undefined");

  const { setDrawType } = useContext(DrawTypeContext);

  useEffect(() => {
    if (firstInitTitle.current == 0) {
      setTitle(docTitle.current);
      firstInitTitle.current = 1;
    }
  });

  function click(e) {
    setActiveButton((preData) =>
      preData.purpose || preData.feature ? {} : preData
    );
    setDrawType("");
    setToolBarPop("");
  }

  const itemImg = {
    back: {
      selected: 0,
      info: [{ feature: "back", imgUrl: iconBackFiles, text: "back Files" }],
    },
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
    title: {
      selected: 0,
      info: [{ feature: "database", imgUrl: upload, text: "database" }],
    },
  };

  function handleTitleChange(e) {
    setTitle(e.target.value);
    docTitle.current = e.target.value;
  }

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
        <div className="toolList__container">
          <CanvasToolItem
            purpose="back"
            data={itemImg["back"]}
            disabled={userLogin === 1 ? false : true}
          ></CanvasToolItem>
          <div className="toolList__separator"></div>
          <CanvasToolItem
            purpose="move"
            data={itemImg["move"]}
            disabled={isMobile}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="draw"
            data={itemImg["draw"]}
            disabled={isMobile}
            changeSelected={setDrawSelected}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="step"
            data={itemImg["undo"]}
            disabled={isMobile}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="step"
            data={itemImg["redo"]}
            disabled={isMobile}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="figure"
            data={itemImg["figure"]}
            disabled={isMobile}
          ></CanvasToolItem>
        </div>
        <div className="toolList__container">
          <input
            type="text"
            maxLength="20"
            className="toolList__title"
            value={title}
            onChange={handleTitleChange}
            disabled={isMobile}
          />
        </div>
        <div className="toolList__container">
          <CanvasToolItem
            purpose="save"
            data={itemImg["save"]}
            disabled={isMobile ? true : userLogin === 1 ? false : true}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="saveFile"
            data={itemImg["saveFile"]}
            changeSelected={setSaveSelected}
            disabled={isMobile}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="canvasRate"
            data={itemImg["zoomIn"]}
            disabled={isMobile || canvasRate.current >= 500}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="canvasRate"
            data={itemImg["zoomOut"]}
            disabled={isMobile || canvasRate.current <= 50}
          ></CanvasToolItem>
          <CanvasToolItem
            purpose="canvasRate"
            data={itemImg["percent"]}
            disabled={true}
          >
            <p className="percent">{canvasRate.current} %</p>
          </CanvasToolItem>
        </div>
      </ActiveButtonContext.Provider>
    </div>
  );
};

export default CanvasToolBar;
export { ActiveButtonContext };
