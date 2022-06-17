import { createSlice } from "@reduxjs/toolkit";
import { startDrawFun, drawTarget } from "../drawFunction";

const initialState = {
  data: [],
  targetData: [],
  step: 0,
  stepRecord: [],
};

const chartReducer = createSlice({
  name: "chart",
  initialState,
  reducers: {
    // init & deleteData & endDraw is same...
    init(state, action) {
      state.data = action.payload.data;
      state.step++;
      state.stepRecord.push(state.data);
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    deleteData(state, action) {
      state.data = action.payload.data;
      state.step++;
      state.stepRecord.push(state.data);
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    nextStep(state, action) {
      state.step++;
      state.data = state.stepRecord[state.step - 1];
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    backStep(state, action) {
      state.step--;
      state.data = state.stepRecord[state.step - 1];
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    startDraw(state, action) {
      // adjust stepRecord by step
      state.stepRecord.splice(state.step, state.stepRecord.length - state.step);
      // add new data item
      state.data.push(
        startDrawFun(
          action.payload.x,
          action.payload.y,
          action.payload.drawType
        )
      );
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    drawing(state, action) {
      state.data = action.payload.data;
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    endDraw(state, action) {
      state.data = action.payload.data;
      // add step
      state.step++;
      state.stepRecord.push(state.data);
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    changeData(state, action) {
      state.data = action.payload.data;
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    drawTargetData(state, action) {
      // redraw targetData
      state.targetData = drawTarget(
        state.data,
        action.payload.targetIndex,
        action.payload.targetPoint
      );
    },
    clear(state) {
      // reset all state
      state.data = [];
      state.targetData = [];
      state.step = 0;
      state.stepRecord = [];
    },
  },
});

export const chartActions = chartReducer.actions;

export default chartReducer;
