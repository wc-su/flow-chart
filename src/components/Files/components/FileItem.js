import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { deleteFile } from "../../../firebase/database";
import { LoadingContext } from "../../../context/LoadingProvider";

const FileItem = ({ children, userId, fileId, setFiles }) => {
  const { setMessage } = useContext(LoadingContext);

  const navigate = useNavigate();

  function linkToChart(e) {
    // console.log(e.target.nodeName);
    if (e.target.nodeName === "BUTTON") {
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

  return (
    <div className="files__item" onClick={linkToChart}>
      {children}
    </div>
  );
};

export default FileItem;
