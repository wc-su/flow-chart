import { app } from "./app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";

const db = getFirestore(app);

async function getDataByUserId(userID) {
  const result = [];
  try {
    const q = query(collection(db, userID), orderBy("updateTime", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      result.push({
        fileId: doc.id,
        title: doc.data().title,
        createTime: doc.data().createTime,
        updateTime: doc.data().updateTime,
        data: doc.data().data,
      });
    });
  } catch (error) {
    console.log("error:", error);
  }
  return result;
}

async function getFiles(userID) {
  const result = await getDataByUserId(userID);
  return result.map((item) => item.fileId);
}

async function getUserRecord(userID) {
  const result = { result: false, dataID: "", data: [], message: "" };
  try {
    const querySnapshot = await getDocs(collection(db, userID));
    result.result = true;
    result.message = "讀取成功";
    if (querySnapshot.size > 0) {
      // 取第一筆
      const document = querySnapshot.docs[0];
      result.dataID = document.id;
      result.data = document.data().data;
    }
  } catch (error) {
    console.log("error:", error);
    result.message = "讀取失敗";
  }
  return result;
}
async function getUserRecordByID(userID, docID) {
  const result = { result: false, dataID: "", data: [], message: "" };
  try {
    const docRef = doc(db, userID, docID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      result.result = true;
      result.dataID = docID;
      result.data = docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("error:", error);
    result.message = "讀取失敗";
  }
  return result;
}

async function addChartRecord(userID, data) {
  const result = { result: false, dataID: "", message: "寫入失敗" };
  try {
    const docRef = await addDoc(collection(db, userID), data);
    result.result = true;
    result.message = "寫入成功";
    result.dataID = docRef.id;
  } catch (error) {
    console.log("error:", error);
  }
  return result;
}
async function addChartRecordByID(userID, docID, data) {
  const result = { result: false, message: "寫入失敗" };
  try {
    await setDoc(doc(db, userID, docID), data, { merge: true });
    result.result = true;
    result.message = "寫入成功";
  } catch (error) {
    console.log("error:", error);
  }
  return result;
}

async function deleteFile(userID, docID) {
  const result = { result: false, message: "刪除失敗" };
  try {
    await deleteDoc(doc(db, userID, docID));
    result.result = true;
    result.message = "刪除成功";
  } catch (error) {
    console.log(error);
  }
  return result;
}

export {
  getUserRecord,
  addChartRecord,
  addChartRecordByID,
  getFiles,
  getUserRecordByID,
  getDataByUserId,
  deleteFile,
};
