import { app } from "./app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

async function authUseGoogle() {
  const returnResult = { result: false, message: "系統錯誤" };
  try {
    await signInWithPopup(auth, provider);
    returnResult.result = true;
    returnResult.message = "登入成功";
  } catch (error) {
    const errorCode = error.code;
    returnResult.message = errorCode.replace("auth/", "");
  }
  return returnResult;
}

async function SignupUseEmail(email, password) {
  const returnResult = { result: false, message: "系統錯誤" };
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    returnResult.result = true;
    returnResult.message = "登入成功";
  } catch (error) {
    const errorCode = error.code;
    returnResult.message = errorCode.replace("auth/", "");
  }
  return returnResult;
}

async function loginUseEmail(email, password) {
  const returnResult = { result: false, message: "系統錯誤" };
  try {
    await signInWithEmailAndPassword(auth, email, password);
    returnResult.result = true;
    returnResult.message = "登入成功";
  } catch (error) {
    const errorCode = error.code;
    returnResult.message = errorCode.replace("auth/", "");
  }
  return returnResult;
}

async function logout() {
  const returnResult = { result: false, message: "系統錯誤" };
  try {
    if (auth.currentUser) {
      await signOut(auth);
      returnResult.result = true;
      returnResult.message = "登出成功";
    } else {
    }
  } catch (error) {
    const errorMessage = error.message;
    returnResult.message = errorMessage;
  }
  return returnResult;
}

async function resetPassword(email) {
  const returnResult = { result: false, message: "系統錯誤" };
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      returnResult.result = "ok";
      returnResult.message = "信件已寄出";
    })
    .catch((error) => {
      const errorCode = error.code;
      returnResult.message = errorCode.replace("auth/", "");
    });
  return returnResult;
}

export {
  auth,
  authUseGoogle,
  loginUseEmail,
  SignupUseEmail,
  logout,
  onAuthStateChanged,
  resetPassword,
};
