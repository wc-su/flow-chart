import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteFile } from "../../../firebase/database";
import { getImg } from "../../../firebase/storage";
import { LoadingContext } from "../../../context/LoadingProvider";

import iconDelete from "../images/delete.png";

const FileItem = ({ userId, item, setFiles }) => {
  const { setMessage } = useContext(LoadingContext);

  const navigate = useNavigate();

  const [imgStyle, setImgStyle] = useState();

  const { fileId, imgId, title, createTime, updateTime } = item;

  useEffect(() => {
    if (!imgStyle) {
      getBgImg();
    }
  }, []);

  function handleFileItemClick(e) {
    if (["BUTTON", "IMG"].includes(e.target.nodeName)) {
      deleteFileItem(userId, fileId);
    } else {
      navigate(`/Chart/${fileId}`);
    }
  }

  async function deleteFileItem(userId, fileId) {
    setMessage("檔案刪除中，請稍候...");
    const result = await deleteFile(userId, fileId);
    if (result.result) {
      setFiles((preData) => {
        return preData.filter((item) => item.fileId !== fileId);
      });
    }
    setMessage("");
  }

  async function getBgImg() {
    const url = await getImg(`${userId}/${imgId}`);
    if (url) {
      setImgStyle((preData) => {
        return {
          preData,
          backgroundImage: `url(${url})`,
        };
      });
    }
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

  return (
    <div className="files__item" onClick={handleFileItemClick}>
      <div className="files__item-img" style={imgStyle}></div>
      <div className="files__item-container">
        <div>
          <p className="files__item-title">{title}</p>
          <p className="files__item-time">
            Created: {setTimeLayout(createTime)}
          </p>
          <p className="files__item-time">
            Edited: {setTimeLayout(updateTime)}
          </p>
        </div>
        <button className="files__item-btn">
          <img src={iconDelete} alt="delete" />
        </button>
      </div>
    </div>
  );
};

export default FileItem;
