import { createSlice, createSelector } from '@reduxjs/toolkit';
import { createShape, buildSelectionOverlay } from '../drawFunction';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  data: [],
  selectedId: null,
  activeHandle: '',
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    init: (state, action) => {
      state.data = action.payload.data;
      state.selectedId = null;
      state.activeHandle = '';
    },
    deleteData: (state, action) => {
      state.data = action.payload.data;
      state.selectedId = null;
      state.activeHandle = '';
    },
    startDraw: {
      // add new data item
      reducer(state, action) {
        state.data.push(createShape(action.payload));
      },
      prepare(x, y, drawType) {
        return { payload: { id: uuidv4(), x, y, drawType } };
      },
    },
    endDraw: (state, action) => {
      state.data = action.payload.data;
    },
    drawing: (state, action) => {
      state.data = action.payload.data;
    },
    changeData: (state, action) => {
      state.data = action.payload.data;
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
      // reset state
      state.data = [];
      state.selectedId = null;
      state.activeHandle = '';
    },
  },
});

export const chartActions = chartSlice.actions;

export const selectData = (state) => state.chart.present.data;
export const selectSelectedId = (state) => state.chart.present.selectedId;
export const selectActiveHandle = (state) => state.chart.present.activeHandle;

export const selectSelectionOverlay = createSelector(
  [selectData, selectSelectedId, selectActiveHandle],
  buildSelectionOverlay
);

export default chartSlice.reducer;
