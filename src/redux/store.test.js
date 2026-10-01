import { describe, it, beforeEach, expect } from 'vitest';
import { makeStore } from './store';
import { chartActions } from './chartSlice';
import { ActionCreators } from 'redux-undo';

const initialState = {
  data: [],
  selectedId: null,
  activeHandle: '',
};

let store;
beforeEach(() => {
  store = makeStore(); // 每個測試開始前都拿到全新的 store
});
const getChart = () => store.getState().chart;
// 回傳「最後一筆被改過」的新 data 陣列
const updateLastShape = (changes) => {
  const data = getChart().present.data;
  return [...data.slice(0, -1), { ...data[data.length - 1], ...changes }];
};
// 完整畫一個圖形 startDraw -> draw -> endDraw
const drawShape = (x, y, drawType) => {
  store.dispatch(chartActions.startDraw(x, y, drawType));
  store.dispatch(chartActions.draw({ data: updateLastShape({ endX: x + 1, endY: y + 1 }) }));
  store.dispatch(chartActions.endDraw({ data: updateLastShape({ endX: x + 4, endY: y + 4 }) }));
};

describe('整合測試', () => {
  it('初始狀態', () => {
    // past: [], present: S0, future: []
    expect(getChart().present).toEqual(initialState);
    expect(getChart().present.data).toHaveLength(0);
    expect(getChart().past).toHaveLength(0);
    expect(getChart().future).toHaveLength(0);
  });

  describe('init 與畫圖', () => {
    it('init', () => {
      const payload = [{ id: 'init-id' }];
      store.dispatch(chartActions.init({ data: payload }));

      // past: [S0], present: S1, future: []
      expect(getChart().present.data).toHaveLength(1);
      expect(getChart().present.data).toEqual(payload);
      expect(getChart().past).toHaveLength(1);
      expect(getChart().future).toHaveLength(0);
    });

    it('畫第一張圖形', () => {
      store.dispatch(chartActions.init({ data: [{ id: 'init-id' }] }));
      drawShape(10, 20, 'process');

      // past: [S0, S1], present: S2, future: []
      expect(getChart().past).toHaveLength(2);
      expect(getChart().past[0].data).toHaveLength(0);
      expect(getChart().past[1].data).toHaveLength(1);
      expect(getChart().present.data).toHaveLength(2);
      expect(getChart().future).toHaveLength(0);
    });

    it('畫兩個圖形', () => {
      store.dispatch(chartActions.init({ data: [{ id: 'init-id' }] }));
      drawShape(10, 20, 'process');
      drawShape(30, 40, 'terminal');

      // past: [S0, S1, S2], present: S3, future: []
      expect(getChart().past).toHaveLength(3);
      expect(getChart().past[0].data).toHaveLength(0);
      expect(getChart().past[1].data).toHaveLength(1);
      expect(getChart().past[2].data).toHaveLength(2);
      expect(getChart().present.data).toHaveLength(3);
      expect(getChart().future).toHaveLength(0);
    });

    it('測試畫一個圖形的 past / present / future，沒有 endDraw 不會記到 past', () => {
      const s0 = getChart().present;

      expect(getChart().past).toHaveLength(0);
      expect(getChart().present).toBe(s0);
      expect(getChart().present.data).toHaveLength(0);
      expect(getChart().future).toHaveLength(0);

      store.dispatch(chartActions.init({ data: [{ id: 'init-id' }] }));
      const s1 = getChart().present;

      expect(getChart().past).toEqual([s0]);
      expect(getChart().present).toBe(s1);
      expect(getChart().future).toHaveLength(0);

      store.dispatch(chartActions.startDraw(10, 20, 'inputOutput'));

      expect(getChart().past).toEqual([s0]);
      expect(getChart().present.data).toHaveLength(2);
      expect(getChart().future).toHaveLength(0);

      const drawData = getChart().present.data;
      const drawLast = drawData[drawData.length - 1];
      store.dispatch(chartActions.draw({ data: [...drawData.slice(0, -1), { ...drawLast, endX: 11, endY: 21 }] }));

      expect(getChart().past).toEqual([s0]);
      expect(getChart().present.data).toHaveLength(2);
      expect(getChart().future).toHaveLength(0);

      const endDrawData = getChart().present.data;
      const endDrawLast = endDrawData[endDrawData.length - 1];
      store.dispatch(
        chartActions.endDraw({ data: [...endDrawData.slice(0, -1), { ...endDrawLast, endX: 15, endY: 25 }] })
      );
      const s2 = getChart().present;

      expect(getChart().past).toEqual([s0, s1]);
      expect(getChart().present).toBe(s2);
      expect(getChart().future).toHaveLength(0);
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
      store.dispatch(chartActions.init({ data: payloadInit }));
      const s1 = getChart().present; // [init]

      drawShape(10, 20, 'process');
      const s2 = getChart().present; // [init, A]

      drawShape(30, 40, 'terminal');
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
      store.dispatch(chartActions.init({ data: payloadInit }));
      const s1 = getChart().present; // [init]

      drawShape(10, 20, 'process');
      const s2 = getChart().present; // [init, A]

      drawShape(30, 40, 'terminal');
      const s3a = getChart().present; // [init, A, B]

      store.dispatch(ActionCreators.undo());

      drawShape(50, 60, 'inputOutput');
      const s3b = getChart().present; // [init, A, C]

      expect(getChart().future).toHaveLength(0);

      store.dispatch(ActionCreators.undo());

      expect(getChart().past).toEqual([s0, s1]);
      expect(getChart().present).toBe(s2);
      expect(getChart().future).toEqual([s3b]);
      expect(getChart().future).not.toContain(s3a);
    });
  });
});

it.todo('開舊檔後 undo，最多退回到開檔時的內容（10/05 決定 clearHistory）');
it.todo('clear 之後不能 undo（10/05 決定 clearHistory）');
