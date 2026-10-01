import { createSlice, createSelector } from '@reduxjs/toolkit';
import { createShape, buildSelectionOverlay } from '../utils/shape';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  shapes: [],
  selectedId: null,
  activeHandle: '',
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    init: (state, action) => {
      state.shapes = action.payload.shapes;
      state.selectedId = null;
      state.activeHandle = '';
    },
    deleteShape: (state, action) => {
      state.shapes = action.payload.shapes;
      state.selectedId = null;
      state.activeHandle = '';
    },
    // 新增圖形初始資料
    startDraw: {
      reducer(state, action) {
        state.shapes.push(createShape(action.payload));
      },
      prepare(x, y, drawType) {
        return { payload: { id: uuidv4(), x, y, drawType } };
      },
    },
    // 畫圖中，滑鼠移動時更新終點和寬高
    draw: (state, action) => {
      state.shapes = action.payload.shapes;
    },
    // 畫圖、移動、縮放結束時使用
    endDraw: (state, action) => {
      state.shapes = action.payload.shapes;
    },
    // 移動、縮放中，滑鼠移動時更新
    changeShape: (state, action) => {
      state.shapes = action.payload.shapes;
    },
    setSelection: (state, action) => {
      state.selectedId = action.payload.selectedId;
      state.activeHandle = action.payload.activeHandle;
    },
    clearSelection: (state) => {
      state.selectedId = null;
      state.activeHandle = '';
    },
    clear(state) {
      state.shapes = [];
      state.selectedId = null;
      state.activeHandle = '';
    },
  },
});

export const chartActions = chartSlice.actions;

export const selectShapes = (state) => state.chart.present.shapes;
export const selectSelectedId = (state) => state.chart.present.selectedId;
export const selectActiveHandle = (state) => state.chart.present.activeHandle;

export const selectSelectionOverlay = createSelector(
  [selectShapes, selectSelectedId, selectActiveHandle],
  buildSelectionOverlay
);

export default chartSlice.reducer;
