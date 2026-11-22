import { createSlice, createSelector } from '@reduxjs/toolkit';
import { ActionCreators } from 'redux-undo';
import { v4 as uuidv4 } from 'uuid';

import {
  createShape,
  buildSelectionOverlay,
  getDrawingBox,
  SHAPE_TYPE,
  normalizeBox,
  getMovedShape,
  getResizingBox,
} from '@/utils/shape';

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
    deleteShape: (state) => {
      state.shapes = state.shapes.filter((shape) => shape.id !== state.selectedId);
      state.selectedId = null;
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
    // 開始縮放圖形
    startResize: (state, action) => {
      const { id, activeHandle } = action.payload;
      const shape = state.shapes.find((shape) => shape.id === id);
      const { startX, startY, endX, endY } = shape;
      switch (activeHandle) {
        case 'nw-resize':
          shape.startX = endX;
          shape.startY = endY;
          shape.endX = startX;
          shape.endY = startY;
          break;
        case 'n-resize':
        case 'ne-resize':
          shape.startY = endY;
          shape.endY = startY;
          break;
        case 'w-resize':
        case 'sw-resize':
          shape.startX = endX;
          shape.endX = startX;
          break;
        case 'e-resize':
        case 's-resize':
        case 'se-resize':
          break;
      }
      state.activeHandle = activeHandle;
    },
    // 畫圖中，滑鼠移動時更新終點和寬高
    draw: (state, action) => {
      const { x, y } = action.payload;
      const shape = state.shapes[state.shapes.length - 1];
      Object.assign(shape, getDrawingBox(shape.type, shape.startX, shape.startY, x, y));
    },
    // 圖形拖曳中
    moveShape: (state, action) => {
      const { initShape, distanceX, distanceY } = action.payload;
      const shape = state.shapes.find((shape) => shape.id === initShape.id);
      Object.assign(shape, getMovedShape({ initShape, distanceX, distanceY }));
    },
    // 圖形縮放中
    resizeShape: (state, action) => {
      const { x, y } = action.payload;
      const shape = state.shapes.find((shape) => shape.id === state.selectedId);
      Object.assign(shape, getResizingBox(state.activeHandle, shape, x, y));
    },
    // 畫圖結束，會進歷史紀錄
    endDraw: (state, action) => {
      const { id } = action.payload;
      const shape = state.shapes.find((shape) => shape.id === id);
      if (shape.type !== SHAPE_TYPE.FLOWLINE) {
        Object.assign(shape, normalizeBox(shape));
      }
      state.selectedId = shape.id;
      state.activeHandle = '';
    },
    // 縮放結束，不會進歷史紀錄
    normalizeShape: (state, action) => {
      const { id } = action.payload;
      const shape = state.shapes.find((shape) => shape.id === id);
      if (shape.type !== SHAPE_TYPE.FLOWLINE) {
        Object.assign(shape, normalizeBox(shape));
      }
      state.activeHandle = '';
    },
    // 移除最後一筆
    cancelDraw(state) {
      state.shapes.pop();
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
export const selectCanUndo = (state) => state.chart.past.length >= 1;
export const selectCanRedo = (state) => state.chart.future.length >= 1;

export const selectSelectionOverlay = createSelector(
  [selectShapes, selectSelectedId, selectActiveHandle],
  buildSelectionOverlay
);

// 開啟檔案：載入圖形並清空歷史紀錄
export const openChart = (shapes) => (dispatch) => {
  dispatch(chartActions.init({ shapes }));
  dispatch(ActionCreators.clearHistory());
};

export default chartSlice.reducer;
