import { configureStore } from "@reduxjs/toolkit";
import { testUserLoginReducer } from "./reducer.js";

const userStore = configureStore({ reducer: testUserLoginReducer });

export { userStore };
