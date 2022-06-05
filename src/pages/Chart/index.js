import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

// import toImg from "react-svg-to-image";
import saveSvgAsPng from "save-svg-as-png";
// console.log(saveSvgAsPng);

import "./index.scss";
import Toolbar from "./pages/Toolbar";
import Canvas from "./pages/Canvas";
import CanvasStyle from "./pages/CanvasStyle";

import { auth } from "../../firebase/auth";
import {
  addChartRecord,
  addChartRecordByID,
  getUserRecord,
} from "../../firebase/database";
import { UserLoginContext } from "../../components/Context/UserProvider";

const DataContext = createContext();
const DrawTypeContext = createContext();

const Chart = () => {
  // console.log("chart```````");
  const navigate = useNavigate();

  const firstLogin = useRef(0);
  const docID = useRef("");

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
  const [activeButton, setActiveButton] = useState({});
  // 畫圖
  const [data, setData] = useState([]);
  // 點選
  // const [dataSelected, setDataSelected] = useState([]);
  const dataSelected = useRef([]);

  const [rerender, setRerender] = useState(false);

  const { userLogin, setUserLogin } = useContext(UserLoginContext);

  useEffect(() => {
    // console.log("<<< Chart >>>", auth.currentUser);
    if (auth.currentUser) {
      // console.log("start ------>");
      // getUserRecord();
      // console.log("end ------>");
    } else {
      // console.log("leave~~~");
      navigate("/");
    }
    // console.log("wwwwww", userLogin);
  }, []);

  if (userLogin && firstLogin.current === 0) {
    // console.log("ssssss");
    firstLogin.current = 1;
    // console.log("eeeee", auth.currentUser.uid);
    getDataFromDB();
  }

  useEffect(() => {
    // console.log(
    //   "Chart.js -> ussEffect activeButton:",
    //   activeButton,
    //   chartIndex.current,
    //   nowStep.current
    // );
    if (activeButton && Object.keys(activeButton).length !== 0) {
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
        console.log("1111", svgRef.current);
        saveSvgAsPng.saveSvgAsPng(svgRef.current, "name");
        // saveSvgAsPng.saveSvgAsPng(svgRef.current, "name", {encoderType: "image/jpeg", encoderOptions: 0.8});
        setActiveButton({});

        // // 會修改我的 html
        // // console.log(document.querySelector('#svgXXX'));
        // toImg("#svgXXX", "name", {
        //   // scale: 3,
        //   // format: 'svg',
        //   // quality: 0.01,
        //   // download: true,
        //   // ignore: '.ignored'
        // }).then((fileData) => {
        //   console.log("2222", fileData);
        //   //do something with the data
        //   setActiveButton({});
        // });
      } else if (
        activeButton.purpose === "save" &&
        activeButton.feature === "database"
      ) {
        saveToDB();
      } else if (
        activeButton.purpose === "canvasRate" &&
        activeButton.feature === "zoomIn"
      ) {
        canvasRate.current += 10;
        setActiveButton({});
      } else if (
        activeButton.purpose === "canvasRate" &&
        activeButton.feature === "zoomOut"
      ) {
        canvasRate.current -= 10;
        setActiveButton({});
      } else if (
        activeButton.purpose === "move" &&
        activeButton.feature === "move"
      ) {
      }
    }
  }, [activeButton]);

  useEffect(() => {
    // console.log("Chart.js -> ussEffect data:", data);
    // console.log(
    //   "Chart.js -> ussEffect data:",
    //   data.length,
    //   needSaveStep.current,
    //   nowStep.current
    // );

    if (tempFlag.current) {
      if (
        activeButton.purpose === "figure" &&
        activeButton.feature === "delete"
      ) {
        chartIndex.current = -1;
      }
      // drawPoint();
      tempFlag.current = false;
      setActiveButton({});
    }
    // 儲存步驟
    if (needSaveStep.current) {
      // console.log(
      //   "Chart.js -> ussEffect data:",
      //   needSaveStep.current,
      //   nowStep.current,
      //   stepRecord.current,
      //   data.length
      // );

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
      // drawPoint();
      stepChangeData.current = false;
    }
  }, [data]);

  async function getDataFromDB() {
    const result = await getUserRecord(auth.currentUser.uid);
    // console.log(result);
    if (result.result) {
      if(result.dataID) {
        docID.current = result.dataID;
        setData(result.data);
        // console.log(result.data);
      }
    }
    // console.log(result.message, result);
  }

  async function saveToDB() {
    // console.log("this~~~~", auth.currentUser.uid);
    if(docID.current) {
      const result = await addChartRecordByID(auth.currentUser.uid, docID.current, { data });
      if (result.result) {
      } else {
      }
      // console.log("byID", result.message, result);
    }else{
      const result = await addChartRecord(auth.currentUser.uid, { data });
      if (result.result) {
        docID.current = result.dataID;
      } else {
      }
      // console.log("firstWrite", result.message, result);
    }
  }

  function drawPoint() {
    setDataSelected((preData) => {
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
        return newData;
      } else {
        return preData.length > 0 ? [] : preData;
      }
    });
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

  return (
    <div className="Chart">
      <DataContext.Provider value={{ data: data, setData: setData }}>
        <DrawTypeContext.Provider
          value={{ drawType: drawType, setDrawType: setDrawType }}
        >
          <Toolbar
            canvasRate={canvasRate}
            chartIndex={chartIndex}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          <div className="main">
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
            />
            <CanvasStyle />
          </div>
        </DrawTypeContext.Provider>
      </DataContext.Provider>
    </div>
  );
};

export default Chart;
export { DataContext, DrawTypeContext };
