import React from "react";
import { useNavigate } from "react-router-dom";

import { deleteFile } from "../../../../firebase/database";

const FileItem = ({ children, userId, fileId, setFiles }) => {
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
    const result = await deleteFile(userId, fileId);
    // console.log("刪除:", result);
    if (result.result) {
      setFiles((preData) => {
        return preData.filter((item) => item.fileId !== fileId);
      });
    }
  }

  return (
    <div className="files__item" onClick={linkToChart}>
      {children}
    </div>
  );
};

export default FileItem;
