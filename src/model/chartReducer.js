import { createSlice } from "@reduxjs/toolkit";
import {} from "../drawFunction";

const initialState = { data: [], targetData: [], step: 0, stepRecord: [] };

function deepCopy(ary) {
  return JSON.parse(JSON.stringify(ary));
}

const chartReducer = createSlice({
  name: "chart",
  initialState,
  reducers: {
    init(state, action) {
      state.data.push(action.payload);
      state.step++;
      state.stepRecord.push(state.data);
    },
    addStep(state) {
      state.step++;
    },
    nextStep(state) {
      state.step++;
      state.data = state.stepRecord[state.step - 1];
    },
    backStep(state) {
      state.step--;
      state.data = state.stepRecord[state.step - 1];
    },
    startDraw(state, action) {
      // 需再多放倍率進來，畫圖時需要加上倍率
      // state.data.push(deepCopy(action.data));
      // console.log("start draw", action.payload);
      // state.data.push(action.payload);
      state.data = action.payload;
    },
    drawing(state, action) {
      // state.data.pop();
      // state.data.push(deepCopy(action.data));
      // console.log("drawing", action.payload);
      // state.data.push(action.payload);
      state.data = action.payload;
    },
    endDraw(state, action) {
      // state.data.pop();
      // state.data.push(deepCopy(action.data));
      // console.log("start end", action.payload);
      // state.data.push(action.payload);
      state.data = action.payload;
      state.step++;
      state.stepRecord.push(action.payload);
    },
    // changeRate(state, action) {
    //   state.data = deepCopy(action.data);
    // }
    changeData(state, action) {
      state.data.pop();
      // state.data.push(deepCopy(action.data));
      // console.log("change draw", action.payload);
      // state.data.push(action.payload);
      state.data = action.payload;
    },
  },
});

export const chartActions = chartReducer.actions;

export default chartReducer;
