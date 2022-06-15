import { app } from "./app";
import {
  getStorage,
  uploadBytes,
  deleteObject,
  ref,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage(app);

const metadata = {
  contentType: "image/png",
};

function uploadImg(imgName, img) {
  const storageRef = ref(storage, imgName);
  const uploadTask = uploadBytes(storageRef, img, metadata).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });
}

async function getImg(imgName) {
  let downloadURL;
  try {
    const storageRef = ref(storage, imgName);
    downloadURL = await getDownloadURL(storageRef);
  } catch (error) {
    console.log("error:", error);
  }
  return downloadURL;
}

async function deleteImg(imgName) {
  let result = false;
  const desertRef = ref(storage, imgName);

  deleteObject(desertRef)
    .then(() => {
      result = true;
    })
    .catch((error) => {
      console.log("error:", error);
    });
  return result;
}

export { uploadImg, getImg, deleteImg };
