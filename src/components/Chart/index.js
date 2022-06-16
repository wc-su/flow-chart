import React, { useState, useRef, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { MobileView, isBrowser } from "react-device-detect";
import { saveSvgAsPng, svgAsPngUri } from "save-svg-as-png";

import "./index.scss";

import Canvas from "./components/Canvas";
import CanvasToolBar from "./components/CanvasToolBar";

import { LoadingContext } from "../../context/LoadingProvider";

import { auth } from "../../firebase/auth";
import { addChartRecordByID, getUserRecordByID } from "../../firebase/database";
import { uploadImg } from "../../firebase/storage";
import { chartActions } from "../../model/chartReducer";

const DrawTypeContext = React.createContext();

const Chart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userStatus } = useSelector((state) => state.user);
  const { data, step, stepRecord } = useSelector((state) => state.chart);

  const { chartId } = useParams();

  const pageCheckFlag = useRef(0);

  const docID = useRef("");
  const docTitle = useRef("undefined");
  const docTitleInitFlag = useRef(0);

  const targetIndex = useRef(-1);
  const targetPoint = useRef("");

  const canvasRate = useRef(100);

  const svgRef = useRef();

  const [drawType, setDrawType] = useState("");
  const [moveCanvas, setMoveCanvas] = useState(false);
  const [activeButton, setActiveButton] = useState({});

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
    if (
      userStatus === 1 &&
      isBrowser &&
      [0, 2].includes(pageCheckFlag.current)
    ) {
      if (chartId) {
        getDataFromDB();
      } else {
        addNewFile();
      }
      pageCheckFlag.current = 1; // 0: first enter page / 1: user logout -> login
    } else if (userStatus === 2 && [0, 1].includes(pageCheckFlag.current)) {
      if (chartId) {
        dispatch(chartActions.clear());
        docTitle.current = "undefined";
        docTitleInitFlag.current = 0;
        navigate("/Chart");
      } else {
        dispatch(chartActions.init({ data: [{ index: uuidv4() }] }));
      }
      pageCheckFlag.current = 2; // 0: first enter page / 1: user login -> logout
    }
  });

  useEffect(() => {
    setMoveCanvas(false);
    if (Object.keys(activeButton).length !== 0) {
      if (
        activeButton.purpose === "figure" &&
        activeButton.feature === "delete"
      ) {
        const newData = data.filter(
          (item) => item.index !== targetIndex.current
        );
        dispatch(chartActions.deleteData({ data: newData }));
        setActiveButton({});
      } else if (
        activeButton.purpose === "step" &&
        activeButton.feature === "undo"
      ) {
        if (step > 0) {
          dispatch(
            chartActions.backStep({
              targetIndex: targetIndex.current,
              targetPoint: targetPoint.current,
            })
          );
        }
        setActiveButton({});
      } else if (
        activeButton.purpose === "step" &&
        activeButton.feature === "redo"
      ) {
        if (step < stepRecord.length) {
          dispatch(
            chartActions.nextStep({
              targetIndex: targetIndex.current,
              targetPoint: targetPoint.current,
            })
          );
        }
        setActiveButton({});
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
        setMoveCanvas(true);
      }
    }
  }, [activeButton]);

  async function getDataFromDB() {
    setMessage("資料讀取中，請稍候...");
    const result = await getUserRecordByID(auth.currentUser.uid, chartId);
    if (result.result) {
      if (result.dataID) {
        docID.current = result.dataID;
        docTitle.current = result.data.title;
        docTitleInitFlag.current = 0;
        dispatch(chartActions.init({ data: result.data.data }));
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

  function handleMainClick() {
    setToolBarPop("");
  }

  return (
    <div className="Chart">
      <DrawTypeContext.Provider
        value={{ drawType: drawType, setDrawType: setDrawType }}
      >
        <CanvasToolBar
          canvasRate={canvasRate}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          toolBarPop={toolBarPop}
          setToolBarPop={setToolBarPop}
          docTitle={docTitle}
          docTitleInitFlag={docTitleInitFlag}
          targetIndex={targetIndex}
        />
        <div className="Chart__main" onClick={handleMainClick}>
          <Canvas
            canvasRate={canvasRate}
            svgRef={svgRef}
            moveCanvas={moveCanvas}
            setActiveButton={setActiveButton}
            targetIndex={targetIndex}
            targetPoint={targetPoint}
          />
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
    </div>
  );
};

export default Chart;
export { DrawTypeContext };
