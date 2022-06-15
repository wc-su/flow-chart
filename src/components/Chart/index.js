import React, { useState, useRef, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { MobileView, isBrowser } from "react-device-detect";
import { saveSvgAsPng, svgAsPngUri } from "save-svg-as-png";

import "./index.scss";

import Canvas from "./components/Canvas";
import CanvasToolBar from "./components/CanvasToolBar";

import { UserContext } from "../../context/UserProvider";
import { LoadingContext } from "../../context/LoadingProvider";

import { auth } from "../../firebase/auth";
import { addChartRecordByID, getUserRecordByID } from "../../firebase/database";
import { uploadImg } from "../../firebase/storage";

const DataContext = React.createContext();
const DrawTypeContext = React.createContext();

const Chart = () => {
  const navigate = useNavigate();
  const { chartId } = useParams();

  const firstLogin = useRef(0);
  const docID = useRef("");
  const docTitle = useRef("undefined");
  const firstInitTitle = useRef(0);

  const chartIndex = useRef(-1);
  const resizeDirection = useRef("");
  const tempFlag = useRef(false);
  const canvasBlockRange = useRef({ minX: 0, minY: 0, maxX: 0, maxY: 0 });

  const canvasRate = useRef(100);

  const svgRef = useRef();

  // 步驟記錄
  const stepRecord = useRef([]);
  // 目前紀錄
  const nowStep = useRef(-1);
  // 需要存取紀錄註記
  const needSaveStep = useRef(true);
  //
  const stepChangeData = useRef(false);

  const [drawType, setDrawType] = useState("");
  const [moveCanvas, setMoveCanvas] = useState(false);
  const [activeButton, setActiveButton] = useState({});
  // 畫圖
  const [data, setData] = useState([]);
  // 點選
  const dataSelected = useRef([]);

  const [rerender, setRerender] = useState(false);

  const { userLogin } = useContext(UserContext);
  const { setMessage } = useContext(LoadingContext);

  const [toolBarPop, setToolBarPop] = useState("");

  // refer to the npm tool: save-svg-as-png
  // https://github.com/exupero/saveSvgAsPng/blob/gh-pages/src/saveSvgAsPng.js
  const uriToBlob = (uri) => {
    const byteString = window.atob(uri.split(",")[1]);
    const mimeString = uri.split(",")[0].split(":")[1].split(";")[0];
    const buffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeString });
  };

  useEffect(() => {
    if (userLogin === 1 && chartId && firstLogin.current === 0) {
      if (isBrowser) {
        firstLogin.current = 1;
        getDataFromDB();
      }
    } else if (userLogin === 2 && chartId) {
      dataSelected.current = [];
      docTitle.current = "undefined";
      firstInitTitle.current = 0;
      setData([]);
      firstLogin.current = 0;
      handleRerender();
      navigate("/Chart");
    }
  });

  useEffect(() => {
    if (!chartId && userLogin === 1 && isBrowser) {
      addNewFile();
      firstLogin.current = 0;
    }
  }, [userLogin]);

  useEffect(() => {
    setMoveCanvas(false);
    if (Object.keys(activeButton).length !== 0) {
      if (
        activeButton.purpose === "figure" &&
        activeButton.feature === "delete" &&
        chartIndex.current !== -1
      ) {
        tempFlag.current = true;
        setData((preData) => {
          const newData = preData.filter(
            (item) => item.index !== chartIndex.current
          );
          drawPoint2(newData);
          return newData;
        });
      } else if (
        activeButton.purpose === "step" &&
        activeButton.feature === "undo"
      ) {
        console.log(" -> undo", nowStep.current, stepRecord.current);
        tempFlag.current = true;
        setData((preData) => {
          if (nowStep.current > 0) {
            stepChangeData.current = true;
            drawPoint2(stepRecord.current[nowStep.current - 1]);
            return stepRecord.current[nowStep.current - 1];
          } else {
            console.log("no step records - undo");
            tempFlag.current = false;
            setActiveButton({});
            return preData;
          }
        });
      } else if (
        activeButton.purpose === "step" &&
        activeButton.feature === "redo"
      ) {
        console.log(" -> redo", nowStep.current, stepRecord.current);
        tempFlag.current = true;
        setData((preData) => {
          if (nowStep.current + 1 >= stepRecord.current.length) {
            console.log("no step records - redo");
            tempFlag.current = false;
            setActiveButton({});
            return preData;
          } else {
            stepChangeData.current = true;
            drawPoint2(stepRecord.current[nowStep.current + 1]);
            return stepRecord.current[nowStep.current + 1];
          }
        });
      } else if (
        activeButton.purpose === "saveFile" &&
        activeButton.feature === "png"
      ) {
        const selectArea = svgRef.current.removeChild(
          svgRef.current.children[1]
        );
        saveSvgAsPng(
          svgRef.current,
          docTitle.current ? docTitle.current : "undefined",
          {
            scale: 100 / canvasRate.current,
          }
        ).finally(() => {
          svgRef.current.appendChild(selectArea);
        });
        setActiveButton({});
      } else if (
        activeButton.purpose === "saveFile" &&
        activeButton.feature === "jpg"
      ) {
        // 將點選區塊移除
        const selectArea = svgRef.current.removeChild(
          svgRef.current.children[1]
        );
        saveSvgAsPng(
          svgRef.current,
          docTitle.current ? docTitle.current : "undefined",
          {
            encoderType: "image/jpeg",
            encoderOptions: 0.8,
            backgroundColor: "#fff",
            scale: 100 / canvasRate.current,
          }
        ).finally(() => {
          // 將點選區塊加回
          svgRef.current.appendChild(selectArea);
        });
        setActiveButton({});
      } else if (
        activeButton.purpose === "save" &&
        activeButton.feature === "database"
      ) {
        saveToDB();
        setActiveButton({});
      } else if (
        activeButton.purpose === "canvasRate" &&
        activeButton.feature === "zoomIn"
      ) {
        const oldRate = canvasRate.current / 100;
        canvasRate.current += 10;
        const newRate = canvasRate.current / 100 / oldRate;
        setData((preData) => {
          let newData = JSON.parse(JSON.stringify(preData));
          newData = newData.map((item) => {
            item.startX *= newRate;
            item.startY *= newRate;
            item.endX *= newRate;
            item.endY *= newRate;
            item.y *= newRate;
            item.x *= newRate;
            item.height *= newRate;
            item.width *= newRate;
            item.decorate.strokeWidth *= newRate;
            return item;
          });
          drawPoint2(newData);
          return newData;
        });
        setActiveButton({});
      } else if (
        activeButton.purpose === "canvasRate" &&
        activeButton.feature === "zoomOut"
      ) {
        const oldRate = canvasRate.current / 100;
        canvasRate.current -= 10;
        const newRate = canvasRate.current / 100 / oldRate;
        setData((preData) => {
          let newData = JSON.parse(JSON.stringify(preData));
          newData = newData.map((item) => {
            item.startX *= newRate;
            item.startY *= newRate;
            item.endX *= newRate;
            item.endY *= newRate;
            item.y *= newRate;
            item.x *= newRate;
            item.height *= newRate;
            item.width *= newRate;
            item.decorate.strokeWidth *= newRate;
            return item;
          });
          drawPoint2(newData);
          return newData;
        });
        setActiveButton({});
      } else if (
        activeButton.purpose === "move" &&
        activeButton.feature === "move"
      ) {
        setMoveCanvas(true);
      }
    }
  }, [activeButton]);

  useEffect(() => {
    if (tempFlag.current) {
      if (
        activeButton.purpose === "figure" &&
        activeButton.feature === "delete"
      ) {
        chartIndex.current = -1;
      }
      tempFlag.current = false;
      setActiveButton({});
    }
    // 儲存步驟
    if (needSaveStep.current) {
      for (let i = nowStep.current + 1; i < stepRecord.current.length; i++) {
        stepRecord.current.pop();
      }

      stepRecord.current.push(data);
      nowStep.current = nowStep.current + 1;

      needSaveStep.current = false;
    }
    // 讀取步驟，重新畫 points
    if (stepChangeData.current) {
      if (activeButton.feature === "undo") {
        nowStep.current--;
      } else if (activeButton.feature === "redo") {
        nowStep.current++;
      }
      console.log(" -> step:", nowStep.current);
      stepChangeData.current = false;
    }
  }, [data]);

  async function getDataFromDB() {
    setMessage("資料讀取中，請稍候...");
    const result = await getUserRecordByID(auth.currentUser.uid, chartId);
    if (result.result) {
      if (result.dataID) {
        docID.current = result.dataID;
        docTitle.current = result.data.title;
        firstInitTitle.current = 0;
        setData(result.data.data);
      }
    } else {
      navigate("/Files");
    }
    setMessage("");
  }

  async function addNewFile() {
    setMessage("新增中，請稍候...");
    const today = new Date();
    const userUid = auth.currentUser.uid;
    docID.current = uuidv4();
    const selectArea = svgRef.current.removeChild(svgRef.current.children[1]);
    svgAsPngUri(svgRef.current, {
      scale: 100 / canvasRate.current,
    })
      .then((uri) => {
        const blob = uriToBlob(uri);
        uploadImg(`/${userUid}/${docID.current}`, blob);
      })
      .finally(() => {
        svgRef.current.appendChild(selectArea);
      });
    const result = await addChartRecordByID(userUid, docID.current, {
      title: docTitle.current ? docTitle.current : "undefined",
      data: data,
      createTime: today.getTime(),
      updateTime: today.getTime(),
    });
    if (result.result) {
      navigate(`/Chart/${docID.current}`);
    } else {
    }
    setMessage("");
  }

  async function saveToDB() {
    setMessage("資料儲存中，請稍候...");
    const today = new Date();
    const userUid = auth.currentUser.uid;
    const selectArea = svgRef.current.removeChild(svgRef.current.children[1]);
    svgAsPngUri(svgRef.current, {
      scale: 100 / canvasRate.current,
    })
      .then((uri) => {
        const blob = uriToBlob(uri);
        uploadImg(`/${userUid}/${docID.current}`, blob);
      })
      .finally(() => {
        svgRef.current.appendChild(selectArea);
      });
    if (docID.current) {
      const result = await addChartRecordByID(userUid, docID.current, {
        title: docTitle.current ? docTitle.current : "undefined",
        data,
        updateTime: today.getTime(),
      });
      if (result.result) {
      } else {
      }
    }
    setMessage("");
  }

  function drawPoint2(data) {
    let originItem = data.find((item) => item.index === chartIndex.current);
    if (chartIndex.current !== -1 && originItem) {
      const originData = JSON.parse(JSON.stringify(originItem));
      if (originData.type !== "flowline") {
        const newStartX = Math.min(originData.startX, originData.endX);
        const newStartY = Math.min(originData.startY, originData.endY);
        const newEndX = Math.max(originData.startY, originData.endY);
        const newEndY = Math.max(originData.startY, originData.endY);
        originData.startX = newStartX;
        originData.startY = newStartY;
        originData.x = newStartX;
        originData.y = newStartY;
        originData.endX = newEndX;
        originData.endY = newEndY;
      }

      const initPoint = JSON.parse(JSON.stringify(originData));

      if (originData.type !== "flowline") {
        originData.type = "process";
        originData.decorate.stroke = "#00a8ff";
        originData.decorate.strokeDasharray = "3";
        originData.pointerEvents = "none";
      }

      const newData = [];
      if (resizeDirection.current !== "") {
        originData.display = "none";
      }
      newData.push(originData);

      const pointWidth = initPoint.width;
      const pointHeight = initPoint.height;
      initPoint.decorate.fill = "#00a8ff";
      initPoint.decorate.stroke = "none";
      initPoint.type = "ellipse";
      initPoint.width = 4;
      initPoint.height = 4;

      const pointConfig = [
        { cursor: "nw-resize", x: 0, y: 0 },
        { cursor: "n-resize", x: 0.5, y: 0 },
        { cursor: "ne-resize", x: 1, y: 0 },
        { cursor: "w-resize", x: 0, y: 0.5 },
        { cursor: "e-resize", x: 1, y: 0.5 },
        { cursor: "sw-resize", x: 0, y: 1 },
        { cursor: "s-resize", x: 0.5, y: 1 },
        { cursor: "se-resize", x: 1, y: 1 },
      ];
      const linePointConfig = [
        { cursor: "start-resize", x: 0, y: 0 },
        { cursor: "end-resize", x: 1, y: 1 },
      ];
      if (originData.type === "flowline") {
        newData.push({ ...initPoint });
        newData[1].index = uuidv4();
        newData[1].cursor = linePointConfig[0].cursor;
        newData[1].x = newData[1].startX;
        newData[1].y = newData[1].startY;
        newData[1].endX = newData[1].startX;
        newData[1].endY = newData[1].startY;
        if (
          resizeDirection.current &&
          resizeDirection.current !== linePointConfig[0].cursor
        ) {
          newData[1].display = "none";
        }
        newData.push({ ...initPoint });
        newData[2].index = uuidv4();
        newData[2].cursor = linePointConfig[1].cursor;
        newData[2].startX = newData[2].endX;
        newData[2].startY = newData[2].endY;
        newData[2].x = newData[2].endX;
        newData[2].y = newData[2].endY;
        if (
          resizeDirection.current &&
          resizeDirection.current !== linePointConfig[1].cursor
        ) {
          newData[2].display = "none";
        }
      } else {
        for (let i = 1; i <= pointConfig.length; i++) {
          newData.push({ ...initPoint });
          newData[i].index = uuidv4();
          newData[i].cursor = pointConfig[i - 1].cursor;
          newData[i].startX += pointWidth * pointConfig[i - 1].x;
          newData[i].startY += pointHeight * pointConfig[i - 1].y;
          newData[i].x = newData[i].startX;
          newData[i].y = newData[i].startY;
          newData[i].endX = newData[i].startX;
          newData[i].endY = newData[i].startY;
          if (resizeDirection.current) {
            newData[i].display =
              pointConfig[i - 1].cursor === resizeDirection.current
                ? "block"
                : "none";
          }
        }
      }
      dataSelected.current = newData;
    } else {
      if (dataSelected.current.length > 0) {
        dataSelected.current = [];
      }
    }
  }

  function handleRerender() {
    setRerender((preData) => !preData);
  }

  function handleMainClick() {
    setToolBarPop("");
  }

  return (
    <div className="Chart">
      <DataContext.Provider value={{ data: data, setData: setData }}>
        <DrawTypeContext.Provider
          value={{ drawType: drawType, setDrawType: setDrawType }}
        >
          <CanvasToolBar
            canvasRate={canvasRate}
            chartIndex={chartIndex}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            toolBarPop={toolBarPop}
            setToolBarPop={setToolBarPop}
            docTitle={docTitle}
            firstInitTitle={firstInitTitle}
          />
          <div className="Chart__main" onClick={handleMainClick}>
            <Canvas
              canvasRate={canvasRate}
              chartIndex={chartIndex}
              // drawPoint={drawPoint}
              resizeDirection={resizeDirection}
              needSaveStep={needSaveStep}
              svgRef={svgRef}
              canvasBlockRange={canvasBlockRange}
              dataSelected={dataSelected}
              drawPoint2={drawPoint2}
              handleRerender={handleRerender}
              tempFlag={tempFlag}
              moveCanvas={moveCanvas}
            />
            {/* <CanvasStyle chartIndex={chartIndex} /> */}
          </div>
          <MobileView className="Chart__prompt">
            <div className="Chart__prompt-container">
              <p className="Chart__prompt-message1">Sorry!</p>
              <p className="Chart__prompt-message2">
                手機及平板尚不支援該功能，請改於電腦上操作，謝謝。
              </p>
            </div>
          </MobileView>
        </DrawTypeContext.Provider>
      </DataContext.Provider>
    </div>
  );
};

export default Chart;
export { DataContext, DrawTypeContext };
