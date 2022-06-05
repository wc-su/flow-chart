import { app } from "./app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  //   writeBatch,
  doc,
} from "firebase/firestore";

const db = getFirestore(app);

async function getUserRecord(userID) {
  const result = { result: false, dataID: "", data: [], message: "" };
  try {
    const querySnapshot = await getDocs(collection(db, userID));
    // querySnapshot.forEach((document) => {
    //   console.log(`${document.id} => ${document.data()}`);
    // });
    // console.log(querySnapshot.docs[0].data().data);
    // const data = querySnapshot.docs[0].data().data;
    // console.log(data == querySnapshot.docs[0].data().data);
    // console.log(data);
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
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
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
    console.log("Document written with ID: ", docRef.id);
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
    await setDoc(doc(db, userID, docID), data);
    result.result = true;
    result.message = "寫入成功";
  } catch (error) {
    console.log("error:", error);
  }
  return result;
}

// async function addChartRecordBatch(userID, arrayData) {
//   //   console.log("batch start ----->", arrayData);
//   const batch = writeBatch(db);

//   //   console.log("batch set start ----->");
//   const nycRef = doc(db, userID, "1");
//   batch.set(nycRef, arrayData);
//   //   console.log("batch set end ----->");

//   await batch.commit();
//   //   console.log("batch end ----->");
// }

export { getUserRecord, addChartRecord, addChartRecordByID };
