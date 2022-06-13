import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect";

import "./index.scss";
// import iconAdd from "./images/plus-sign.png";
import iconAdd from "./images/plus.png";

import { UserLoginContext } from "../../context/UserProvider";
import { LoadingContext } from "../../context/LoadingProvider";

import {
  getFiles,
  getDataByUserId,
  addChartRecord,
} from "../../firebase/database";
import { auth } from "../../firebase/auth";

import FileItem from "./components/FileItem";

const Files = () => {
  const [files, setFiles] = useState([]);
  const { userLogin } = useContext(UserLoginContext);
  const { setMessage } = useContext(LoadingContext);

  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("Files -> useEffect files:", files, userLogin);
  //   // setMessage("載入中，請稍候...");
  //   // // console.log("1");
  //   // if (userLogin) {
  //   //     console.log("login and get data");
  //   //     getFilesFromDB();
  //   // } else {
  //   // //   console.log("2");
  //   //   setMessage("請先登入");
  //   //   setTimeout(() => {
  //   //     navigate("/");
  //   //   }, 5000);
  //   // }
  //   // // console.log("3");
  //   // setMessage("");
  // }, [files]);

  useEffect(() => {
    // console.log("Files -> useEffect userLogin:", userLogin, files, message);
    if (userLogin === 0) {
      setMessage("載入中，請稍候...");
    }
    if (userLogin === 1) {
      setMessage("載入中，請稍候...");
      getFilesFromDB();
    } else if (userLogin == 2) {
      navigate("/");
    }
  }, [userLogin]);

  async function getFilesFromDB() {
    const result = await getDataByUserId(auth.currentUser.uid);
    setFiles(result);
    setMessage("");
  }

  function setTimeLayout(timeModify) {
    const newDate = new Date(timeModify);
    const year = newDate.getFullYear();
    const month = newDate.getMonth().toString().padStart(2, "0");
    const date = newDate.getDate().toString().padStart(2, "0");
    const hours = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    const seconds = newDate.getSeconds().toString().padStart(2, "0");
    return `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;
  }

  async function addNewFile() {
    if (isMobile) {
    } else {
      const today = new Date();
      const result = await addChartRecord(auth.currentUser.uid, {
        title: "undefined",
        data: [],
        createTime: today.getTime(),
        updateTime: today.getTime(),
      });
      if (result.result) {
        const fileId = result.dataID;
        navigate(`/Chart/${fileId}`);
      } else {
      }
    }
  }

  return (
    <div className="files">
      <div className="files__banner">
        <p className="files__banner-userEmail">
          {userLogin === 1 && auth.currentUser.email}
        </p>
      </div>
      <div className="files__content">
        <div className="files__item files__item-add" onClick={addNewFile}>
          <img src={iconAdd} alt="add"></img>
        </div>
        {files.map((item) => {
          return (
            <FileItem
              key={item.fileId}
              userId={auth.currentUser ? auth.currentUser.uid : null}
              fileId={item.fileId}
              setFiles={setFiles}
            >
              <p className="files__item-title">{item.title}</p>
              <p className="files__item-time">
                建立時間：{setTimeLayout(item.createTime)}
              </p>
              <p className="files__item-time">
                修改時間：{setTimeLayout(item.updateTime)}
              </p>
              <button className="files__item-btn">刪除</button>
            </FileItem>
          );
        })}
      </div>
    </div>
  );
};

export default Files;
