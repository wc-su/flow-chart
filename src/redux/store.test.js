import { describe, it, beforeEach, expect } from 'vitest';
import { makeStore } from './store';
import { chartActions, selectCanUndo, selectCanRedo } from './chartSlice';
import { ActionCreators } from 'redux-undo';
import { SHAPE_TYPE } from '@/utils/shape';

const initialState = {
  shapes: [],
  selectedId: null,
  activeHandle: '',
};

let store;
beforeEach(() => {
  store = makeStore(); // 每個測試開始前都拿到全新的 store
});
const getChart = () => store.getState().chart;
// 完整畫一個圖形 startDraw -> draw -> endDraw
const drawShape = (startX, startY, drawType, endX, endY) => {
  store.dispatch(chartActions.startDraw(startX, startY, drawType));
  store.dispatch(chartActions.draw({ x: endX, y: endY }));
  store.dispatch(chartActions.endDraw());
};

describe('整合測試', () => {
  it('初始狀態', () => {
    // past: [], present: S0, future: []
    expect(getChart().present).toEqual(initialState);
    expect(getChart().present.shapes).toHaveLength(0);
    expect(getChart().past).toHaveLength(0);
    expect(getChart().future).toHaveLength(0);
  });

  describe('init 與畫圖', () => {
    it('init', () => {
      const payload = [{ id: 'init-id' }];
      store.dispatch(chartActions.init({ shapes: payload }));

      // past: [S0], present: S1, future: []
      expect(getChart().present.shapes).toHaveLength(1);
      expect(getChart().present.shapes).toEqual(payload);
      expect(getChart().past).toHaveLength(1);
      expect(getChart().future).toHaveLength(0);
    });

    it('畫第一張圖形', () => {
      store.dispatch(chartActions.init({ shapes: [{ id: 'init-id' }] }));
      drawShape(10, 20, SHAPE_TYPE.TERMINAL, 100, 200);

      // past: [S0, S1], present: S2, future: []
      expect(getChart().past).toHaveLength(2);
      expect(getChart().past[0].shapes).toHaveLength(0);
      expect(getChart().past[1].shapes).toHaveLength(1);
      expect(getChart().present.shapes).toHaveLength(2);
      const shapes = getChart().present.shapes;
      expect(shapes[1].startX).toBe(10);
      expect(shapes[1].startY).toBe(20);
      expect(shapes[1].x).toBe(10);
      expect(shapes[1].y).toBe(20);
      expect(shapes[1].endX).toBe(100);
      expect(shapes[1].endY).toBe(200);
      expect(shapes[1].width).toBe(90);
      expect(shapes[1].height).toBe(180);
      expect(getChart().future).toHaveLength(0);
    });

    it('畫兩個圖形', () => {
      store.dispatch(chartActions.init({ shapes: [{ id: 'init-id' }] }));
      drawShape(10, 20, SHAPE_TYPE.PROCESS, 200, 300);
      drawShape(30, 40, SHAPE_TYPE.TERMINAL, 100, 600);

      // past: [S0, S1, S2], present: S3, future: []
      expect(getChart().past).toHaveLength(3);
      expect(getChart().past[0].shapes).toHaveLength(0);
      expect(getChart().past[1].shapes).toHaveLength(1);
      expect(getChart().past[2].shapes).toHaveLength(2);
      expect(getChart().present.shapes).toHaveLength(3);
      expect(getChart().future).toHaveLength(0);
    });

    it('測試畫一個圖形的 past / present / future，沒有 endDraw 不會記到 past', () => {
      const s0 = getChart().present;

      expect(getChart().past).toHaveLength(0);
      expect(getChart().present).toBe(s0);
      expect(getChart().present.shapes).toHaveLength(0);
      expect(getChart().future).toHaveLength(0);

      store.dispatch(chartActions.init({ shapes: [{ id: 'init-id' }] }));
      const s1 = getChart().present;

      expect(getChart().past).toEqual([s0]);
      expect(getChart().present).toBe(s1);
      expect(getChart().future).toHaveLength(0);

      store.dispatch(chartActions.startDraw(10, 20, 'inputOutput'));

      expect(getChart().past).toEqual([s0]);
      expect(getChart().present.shapes).toHaveLength(2);
      expect(getChart().future).toHaveLength(0);

      store.dispatch(chartActions.draw({ x: 11, y: 21 }));

      expect(getChart().past).toEqual([s0]);
      expect(getChart().present.shapes).toHaveLength(2);
      expect(getChart().future).toHaveLength(0);

      store.dispatch(chartActions.endDraw());
      const s2 = getChart().present;

      expect(getChart().past).toEqual([s0, s1]);
      expect(getChart().present).toBe(s2);
      expect(getChart().future).toHaveLength(0);
    });

    it('太小的圖形不進歷史', () => {
      store.dispatch(chartActions.init({ shapes: [{ id: 'init-id' }] }));
      drawShape(10, 20, SHAPE_TYPE.PROCESS, 200, 300);

      const prevState = getChart();

      // 高度不滿 24，取消畫圖
      store.dispatch(chartActions.startDraw(500, 600, SHAPE_TYPE.INPUTOUTPUT));
      store.dispatch(chartActions.draw({ x: 400, y: 623 }));
      store.dispatch(chartActions.cancelDraw());

      expect(getChart().past).toEqual(prevState.past);
      expect(getChart().present).toEqual(prevState.present);
    });
  });

  describe('測試 undo/redo', () => {
    it('初始後直接 undo', () => {
      const past = getChart().past;
      const present = getChart().present;
      const future = getChart().future;

      store.dispatch(ActionCreators.undo());

      expect(getChart().past).toBe(past);
      expect(getChart().present).toBe(present);
      expect(getChart().future).toBe(future);
    });

    it('畫兩個圖形，測試 undo/redo', () => {
      const s0 = getChart().present;

      const payloadInit = [{ id: 'init-id' }];
      store.dispatch(chartActions.init({ shapes: payloadInit }));
      const s1 = getChart().present; // [init]

      drawShape(10, 20, SHAPE_TYPE.PROCESS, 200, 300);
      const s2 = getChart().present; // [init, A]

      drawShape(30, 40, SHAPE_TYPE.TERMINAL, 180, 150);
      const s3 = getChart().present; // [init, A, B]

      store.dispatch(ActionCreators.undo());
      // past: [S0, S1], present: S2, future: [S3]
      expect(getChart().past).toEqual([s0, s1]);
      expect(getChart().present).toBe(s2);
      expect(getChart().future).toEqual([s3]);

      store.dispatch(ActionCreators.undo());
      // past: [S0], present: S1, future: [S2, S3]
      expect(getChart().past).toEqual([s0]);
      expect(getChart().present).toBe(s1);
      expect(getChart().future).toEqual([s2, s3]);

      store.dispatch(ActionCreators.undo());
      // past: [], present: S0, future: [S1, S2, S3]
      expect(getChart().past).toHaveLength(0);
      expect(getChart().present).toBe(s0);
      expect(getChart().future).toEqual([s1, s2, s3]);

      // 執行不會報錯，past / present / future 維持和之前一樣
      store.dispatch(ActionCreators.undo());
      // past: [], present: S0, future: [S1, S2, S3]
      expect(getChart().past).toHaveLength(0);
      expect(getChart().present).toBe(s0);
      expect(getChart().future).toEqual([s1, s2, s3]);

      store.dispatch(ActionCreators.redo());
      // past: [S0], present: S1, future: [S2, S3]
      expect(getChart().past).toEqual([s0]);
      expect(getChart().present).toBe(s1);
      expect(getChart().future).toEqual([s2, s3]);
    });

    it('畫兩個圖形，之後 undo，再畫新一個圖形', () => {
      const s0 = getChart().present;

      const payloadInit = [{ id: 'init-id' }];
      store.dispatch(chartActions.init({ shapes: payloadInit }));
      const s1 = getChart().present; // [init]

      drawShape(10, 20, SHAPE_TYPE.PROCESS, 200, 100);
      const s2 = getChart().present; // [init, A]

      drawShape(30, 40, SHAPE_TYPE.TERMINAL, 400, 150);
      const s3a = getChart().present; // [init, A, B]

      store.dispatch(ActionCreators.undo());

      drawShape(50, 60, SHAPE_TYPE.INPUTOUTPUT, 250, 360);
      const s3b = getChart().present; // [init, A, C]

      expect(getChart().future).toHaveLength(0);

      store.dispatch(ActionCreators.undo());

      expect(getChart().past).toEqual([s0, s1]);
      expect(getChart().present).toBe(s2);
      expect(getChart().future).toEqual([s3b]);
      expect(getChart().future).not.toContain(s3a);
    });

    it('selectCanUndo、selectCanRedo 跟著 past、future 改變', () => {
      // 初始狀態，兩個都是 false
      expect(selectCanUndo(store.getState())).toBe(false);
      expect(selectCanRedo(store.getState())).toBe(false);

      const payloadInit = [{ id: 'init-id' }];
      store.dispatch(chartActions.init({ shapes: payloadInit }));

      // 新增 init 之後，可以 undo，不能執行 redo
      expect(selectCanUndo(store.getState())).toBe(true);
      expect(selectCanRedo(store.getState())).toBe(false);

      // 執行 undo
      store.dispatch(ActionCreators.undo());
      // 可以 redo，不能執行 undo
      expect(selectCanUndo(store.getState())).toBe(false);
      expect(selectCanRedo(store.getState())).toBe(true);
    });

    it('畫完圖後 undo 會取消選取', () => {
      const payloadInit = [{ id: 'init-id' }];
      store.dispatch(chartActions.init({ shapes: payloadInit }));

      // 畫圖
      drawShape(10, 20, SHAPE_TYPE.PROCESS, 200, 100);
      const s2Id = getChart().present.shapes[1].id;

      expect(getChart().present.selectedId).toBe(s2Id);

      // undo
      store.dispatch(ActionCreators.undo());

      expect(getChart().present.selectedId).toBe(null);
      expect(getChart().present.shapes).toHaveLength(1);
    });

    it('取消之後再畫一個，undo 一次', () => {
      const payloadInit = [{ id: 'init-id' }];
      store.dispatch(chartActions.init({ shapes: payloadInit }));
      const s1 = getChart().present;

      // 寬度太小，執行 cancelDraw
      store.dispatch(chartActions.startDraw(100, 200, SHAPE_TYPE.TERMINAL));
      store.dispatch(chartActions.draw({ x: 123, y: 400 }));
      store.dispatch(chartActions.cancelDraw());

      // 正常畫圖
      drawShape(10, 20, SHAPE_TYPE.PROCESS, 200, 100);

      // undo
      store.dispatch(ActionCreators.undo());

      expect(getChart().present).toBe(s1);
    });
  });
});

it.todo('開舊檔後 undo，最多退回到開檔時的內容（10/05 決定 clearHistory）');
it.todo('clear 之後不能 undo（10/05 決定 clearHistory）');
