import React, { useState, useRef, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";

// import toImg from "react-svg-to-image";
import saveSvgAsPng from "save-svg-as-png";
// console.log(saveSvgAsPng);

import "./index.scss";
import Toolbar from "./components/ToolBar";
import Canvas from "./components/Canvas";
import CanvasStyle from "./components/Canvas/components/CanvasStyle";

import { auth } from "../../firebase/auth";
import {
  addChartRecord,
  addChartRecordByID,
  getUserRecord,
  getUserRecordByID,
} from "../../firebase/database";
import { UserLoginContext } from "../../context/UserProvider";
import { LoadingContext } from "../../context/LoadingProvider";

const DataContext = React.createContext();
const DrawTypeContext = React.createContext();

const Chart = () => {
  const navigate = useNavigate();
  const { chartId } = useParams();

  const firstLogin = useRef(0);
  const docID = useRef("");
  const docTitle = useRef("");

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
  // const [dataSelected, setDataSelected] = useState([]);
  const dataSelected = useRef([]);

  const [rerender, setRerender] = useState(false);

  const { userLogin, setUserLogin } = useContext(UserLoginContext);
  const { message, setMessage } = useContext(LoadingContext);

  const [toolBarPop, setToolBarPop] = useState("");

  // if(chartId && !userLogin) {
  // navigate("/Chart");}

  useEffect(() => {
    // console.log(
    //   "Chart: useEffect []:",
    //   userLogin,
    //   firstLogin.current,
    //   chartId
    //   // auth.currentUser.uid
    // );
    // if(chartId) {
    //   // firstLogin.current = 1;
    //   getDataFromDB();
    // }
    // if (auth.currentUser && userLogin) {
    //   getDataFromDB();
    // }
  }, []);

  useEffect(() => {
    // if (userLogin && firstLogin.current === 0) {
    //   // console.log("ssssss");
    //   firstLogin.current = 1;
    //   // console.log("eeeee", auth.currentUser.uid);
    //   getDataFromDB();
    // }
    // 使用者原本登入，後來登出 => 將畫布清掉
    // if (!userLogin && firstLogin.current === 1) {
    //   // console.log("ssssss");
    //   firstLogin.current = 2;
    //   // console.log("eeeee", auth.currentUser.uid);
    //   setData([]);
    // }
    // console.log(
    //   "Chart: useEffect every:",
    //   " chartId:",
    //   chartId,
    //   "/ userLogin:",
    //   userLogin,
    //   "/ firstLogin:",
    //   firstLogin.current,
    //   // "/ auth:",
    //   // auth.currentUser
    // );
    if (userLogin === 1 && chartId && firstLogin.current === 0) {
      // if (userLogin === 1 && chartId) {
      firstLogin.current = 1;
      getDataFromDB();
    } else if (userLogin === 2 && chartId) {
      dataSelected.current = [];
      setData([]);
      navigate("/Chart");
      firstLogin.current = 0;
    }
  });

  // console.log(
  //   "Chart: into:",
  //   userLogin,
  //   firstLogin.current,
  //   chartId,
  // );

  useEffect(() => {
    // console.log(
    //   "Chart: useEffect userLogin:",
    //   " userLogin:",
    //   userLogin,
    //   "/ firstLogin:",
    //   firstLogin.current,
    //   "/ chartId:",
    //   chartId
    // );
    if (!chartId && userLogin === 1) {
      // console.log("start add new file");
      addNewFile();
      firstLogin.current = 0;
    }
    // else if (userLogin === 2 && chartId) {
    //   dataSelected.current = [];
    //   setData([]);
    //   navigate("/Chart");
    //   firstLogin.current = 0;
    // }
  }, [userLogin]);

  useEffect(() => {
    // console.log(
    //   "Chart.js -> ussEffect activeButton:",
    //   activeButton,
    //   Object.keys(activeButton).length,
    //   chartIndex.current,
    //   nowStep.current
    // );
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
        // console.log("1111", svgRef.current);
        // const ttt = svgRef.current.getAttribute("width");
        // console.log(ttt);
        // svgRef.current.setAttribute("width", ttt);
        const selectArea = svgRef.current.removeChild(
          svgRef.current.children[1]
        );
        saveSvgAsPng
          .saveSvgAsPng(
            svgRef.current,
            docTitle.current ? docTitle.current : "undefined",
            {
              scale: 100 / canvasRate.current,
            }
          )
          .then(() => {
            svgRef.current.appendChild(selectArea);
          });
        // saveSvgAsPng.saveSvgAsPng(svgRef.current, "name", {width: "", height: ""});
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
        activeButton.purpose === "saveFile" &&
        activeButton.feature === "jpg"
      ) {
        // console.log(svgRef.current, svgRef.current.children);
        // 將點選區塊移除
        const selectArea = svgRef.current.removeChild(
          svgRef.current.children[1]
        );
        // console.log(tttt, svgRef.current);
        saveSvgAsPng
          .saveSvgAsPng(
            svgRef.current,
            docTitle.current ? docTitle.current : "undefined",
            {
              encoderType: "image/jpeg",
              encoderOptions: 0.8,
              backgroundColor: "#fff",
              scale: 100 / canvasRate.current,
            }
          )
          .then(() => {
            // console.log("ok");
            // 將點選區塊加回
            svgRef.current.appendChild(selectArea);
          });
        // console.log("xxx");
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

  useEffect(() => {
    // console.log("Chart.js -> ussEffect drawType:", drawType);
  }, [drawType]);

  async function getDataFromDB() {
    // console.log("getDataFromDB start: chartId:", chartId, auth.currentUser);
    setMessage("資料讀取中，請稍候...");
    const result = await getUserRecordByID(auth.currentUser.uid, chartId);
    // console.log("getDataFromDB result:", result);
    if (result.result) {
      if (result.dataID) {
        docID.current = result.dataID;
        docTitle.current = result.data.title;
        // console.log("rrrrr", result.data, docTitle.current);
        setData(result.data.data);
        // console.log(result.data);
      }
    } else {
      navigate("/Files");
    }
    setMessage("");
    // console.log(result.message, result);
  }

  async function addNewFile() {
    // console.log("sssss");
    const today = new Date();
    const result = await addChartRecord(auth.currentUser.uid, {
      title: docTitle.current ? docTitle.current : "undefined",
      data: data,
      createTime: today.getTime(),
      updateTime: today.getTime(),
    });
    console.log("add", result);
    if (result.result) {
      const fileId = result.dataID;
      navigate(`/Chart/${fileId}`);
    } else {
    }
  }

  async function saveToDB() {
    setMessage("資料儲存中，請稍候...");
    // console.log("this~~~~", auth.currentUser.uid);
    const today = new Date();
    if (docID.current) {
      const result = await addChartRecordByID(
        auth.currentUser.uid,
        docID.current,
        {
          data,
          updateTime: today.getTime(),
          title: docTitle.current ? docTitle.current : "undefined",
        }
      );
      if (result.result) {
      } else {
      }
      // console.log("byID", result.message, result);
    }
    // else {
    //   const result = await addChartRecord(auth.currentUser.uid, {
    //     data,
    //     createTime: today.getTime(),
    //     updateTime: today.getTime(),
    //   });
    //   if (result.result) {
    //     docID.current = result.dataID;
    //   } else {
    //   }
    //   // console.log("firstWrite", result.message, result);
    // }
    setMessage("");
  }

  function drawPoint2(data) {
    // console.log(chartIndex.current, data);
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
          <Toolbar
            canvasRate={canvasRate}
            chartIndex={chartIndex}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
            toolBarPop={toolBarPop}
            setToolBarPop={setToolBarPop}
            docTitle={docTitle}
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
        </DrawTypeContext.Provider>
      </DataContext.Provider>
    </div>
  );
};

export default Chart;
export { DataContext, DrawTypeContext };
