import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userReducer";

const store = configureStore({
  reducer: userReducer.reducer,
});

export default store;
