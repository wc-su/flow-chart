import { app } from "./app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
// console.log("uuuuu", auth.currentUser, auth);

async function loginUseGoogle() {
  const returnResult = { result: false, data: {}, message: "系統錯誤" };
  // console.log("this~~~");
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // console.log("token:", token);
    // console.log("user:", user);
    // console.log(" --> ", user.email, user.uid);
    // const ttt = await user.getIdToken();
    // console.log("ttt:", ttt);
    returnResult.result = true;
    // returnResult.data = {
    //   uid: user.uid,
    //   email: user.email,
    // };
    returnResult.message = "登入成功";
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // console.log("yyy", errorCode, errorMessage, email, credential);
    returnResult.message = errorMessage;
  }

  // console.log("end~~~");
  return returnResult;
}

async function SignupUseEmail(email, password) {
  const returnResult = { result: false, data: {}, message: "系統錯誤" };
  try {
    // Signed in
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // console.log("xxx2", user);
    returnResult.result = true;
    // returnResult.data = {
    //   uid: user.uid,
    //   email: user.email,
    // };
    returnResult.message = "登入成功";

    // await verifyEmail();
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // console.log("yyy2", errorCode, errorMessage);
    returnResult.message = errorMessage;
  }
  return returnResult;
}

async function loginUseEmail(email, password) {
  const returnResult = { result: false, data: {}, message: "系統錯誤" };
  try {
    // Signed in
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    returnResult.result = true;
    // returnResult.data = {
    //   uid: user.uid,
    //   email: user.email,
    // };
    returnResult.message = "登入成功";
    // console.log("xxx3", user);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // console.log("yyy3", errorCode, errorMessage);
    returnResult.message = errorMessage;
  }
  return returnResult;
}

async function logout() {
  const returnResult = { result: false, data: {}, message: "系統錯誤" };
  try {
    if (auth.currentUser) {
      await signOut(auth);
      // console.log("Sign-out successful", auth);
      returnResult.result = true;
      returnResult.message = "登出成功";
    } else {
      // console.log("have been Sign-out", auth);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // console.log("yyy3", errorCode, errorMessage);
    returnResult.message = errorMessage;
  }
  //   await signOut(auth)
  //     .then(() => {
  //       // Sign-out successful.
  //       console.log("Sign-out successful", auth);
  //       returnResult.result = true;
  //       returnResult.message = "登出成功";
  //     })
  //     .catch((error) => {
  //       // An error ocurred
  //       // ...
  //       console.log("error", error);
  //     });
  return returnResult;
}

async function verifyEmail() {
  sendEmailVerification(auth.currentUser).then(() => {
    // Email verification sent!
    // ...
    // console.log("what happaned");
  });
}

export {
  auth,
  loginUseGoogle,
  loginUseEmail,
  SignupUseEmail,
  logout,
  verifyEmail,
  onAuthStateChanged,
};
