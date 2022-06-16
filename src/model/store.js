import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userReducer";
import chartReducer from "./chartReducer";

const store = configureStore({
  reducer: { user: userReducer.reducer, chart: chartReducer.reducer },
});

export default store;
