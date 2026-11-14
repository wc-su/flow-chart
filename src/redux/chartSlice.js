import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  createShape,
  buildSelectionOverlay,
  getDrawingBox,
  SHAPE_TYPE,
  normalizeBox,
  getMovedShape,
} from '@/utils/shape';
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
      const { x, y } = action.payload;
      const shape = state.shapes[state.shapes.length - 1];
      Object.assign(shape, getDrawingBox(shape.startX, shape.startY, x, y));
    },
    // 圖形拖曳中
    moveShape: (state, action) => {
      const { initShape, distanceX, distanceY } = action.payload;
      const shape = state.shapes.find((shape) => shape.id === initShape.id);
      Object.assign(shape, getMovedShape({ initShape, distanceX, distanceY }));
    },
    // 畫圖結束時使用
    endDraw: (state, action) => {
      const { id } = action.payload;
      const shape = state.shapes.find((shape) => shape.id === id);
      if (shape.type !== SHAPE_TYPE.FLOWLINE) {
        Object.assign(shape, normalizeBox(shape));
      }
      state.selectedId = shape.id;
    },
    // 移除最後一筆
    cancelDraw(state) {
      state.shapes.pop();
    },
    // 縮放中，滑鼠移動時更新
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
export const selectCanUndo = (state) => state.chart.past.length >= 1;
export const selectCanRedo = (state) => state.chart.future.length >= 1;

export const selectSelectionOverlay = createSelector(
  [selectShapes, selectSelectedId, selectActiveHandle],
  buildSelectionOverlay
);

export default chartSlice.reducer;
