import React, { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { auth } from "../../firebase/auth";

import "./index.scss";
import { UserLoginContext } from "../../context/UserProvider";
import { LoadingContext } from "../../context/LoadingProvider";
import { getDataByUserId, addChartRecord } from "../../firebase/database";
import FileItem from "./components/FileItem";

import iconAdd from "./images/plus.png";

const Files = () => {
  const [files, setFiles] = useState([]);
  const { userLogin } = useContext(UserLoginContext);
  const { setMessage } = useContext(LoadingContext);

  const navigate = useNavigate();

  useEffect(() => {
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

  async function addNewFile() {
    if (isMobile) {
    } else {
      setMessage("新增中，請稍候...");
      const today = new Date();
      const userUid = auth.currentUser.uid;
      const imgId = uuidv4();
      const result = await addChartRecord(userUid, {
        imgId,
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
      setMessage("");
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
              item={item}
              setFiles={setFiles}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Files;
