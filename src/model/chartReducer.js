import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [], step: -1 };

const chartReducer = createSlice()({
  name: "chart",
  initialState,
  reducer: {
    addData(state, action) {
      state.data = action.data;
      state.step++;
    },
    nexStep(state) {
      state.step++;
      // state.data =
    },
  },
});

export const chartActions = chartReducer.actions;

export default chartReducer;
