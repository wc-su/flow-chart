import { describe, it, expect, vi } from 'vitest';
import chartReducer, { chartActions } from './chartReducer';

vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

const initialState = {
  data: [],
  selectedId: null,
  activeHandle: '',
};

const generateData = (replace) => {
  return {
    id: 'test-uuid',
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: 'terminal',
    decorate: {
      fill: '#FFFFFF',
      fillOpacity: '0',
      stroke: '#000000',
      strokeWidth: '1.3',
      strokeMiterlimit: 10,
      strokeDasharray: '0',
    },
    cursor: 'move',
    pointerEvents: 'all',
    display: 'block',
    ...replace,
  };
};

describe('chartReducer', () => {
  it('初始狀態', () => {
    const state = chartReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual(initialState);
  });

  describe('init', () => {
    it('帶入資料作為第一筆資料', () => {
      const prev = { data: [], selectedId: 'test-3', activeHandle: 'nw-resize' };
      const newData = [generateData()];
      const state = chartReducer(prev, chartActions.init({ data: newData }));

      expect(state.data).toBe(newData);
      expect(state.selectedId).toBeNull();
      expect(state.activeHandle).toBe('');
    });
  });

  describe('deleteData', () => {
    it('刪除 data，並清除選取狀態', () => {
      const keep = generateData({ id: 'keep' });
      const remove = generateData({ id: 'remove' });
      const prev = {
        data: [keep, remove],
        selectedId: 'test-1',
        activeHandle: 'w-resize',
      };
      const state = chartReducer(prev, chartActions.deleteData({ data: [keep] }));

      expect(state.data).toEqual([keep]);
      expect(state.selectedId).toBeNull();
      expect(state.activeHandle).toBe('');
    });
  });

  describe('startDraw', () => {
    it('prepare 產生的 payload', () => {
      const action = chartActions.startDraw(10, 20, 'process');

      expect(action.payload).toEqual({ id: 'test-uuid', x: 10, y: 20, drawType: 'process' });
    });

    it('畫出新圖形的第一步', () => {
      const prev = { data: [], selectedId: 'test-1', activeHandle: 'se-resize' };
      const state = chartReducer(prev, chartActions.startDraw(10, 20, 'process'));

      expect(state.data[0]).toEqual(
        generateData({ startX: 10, startY: 20, endX: 10, endY: 20, x: 10, y: 20, type: 'process' })
      );
      expect(state.data).toHaveLength(1);
      expect(state.selectedId).toBe(prev.selectedId);
      expect(state.activeHandle).toBe(prev.activeHandle);
    });

    it('已有舊資料，畫出新圖形的第一步', () => {
      const prev = { data: [generateData()], selectedId: 'test-2', activeHandle: 'n-resize' };
      const state = chartReducer(prev, chartActions.startDraw(10, 30, 'decision'));

      expect(state.data[0]).toBe(prev.data[0]);
      expect(state.selectedId).toBe(prev.selectedId);
      expect(state.activeHandle).toBe(prev.activeHandle);
      expect(state.data[1]).toEqual(
        generateData({ startX: 10, startY: 30, endX: 10, endY: 30, x: 10, y: 30, type: 'decision' })
      );
      expect(state.data).toHaveLength(2);
    });
  });

  describe('繪畫', () => {
    it.each([
      ['endDraw', chartActions.endDraw],
      ['drawing', chartActions.drawing],
      ['changeData', chartActions.changeData],
    ])('%s', (_name, action) => {
      const prev = { data: [generateData()], selectedId: 'test-1', activeHandle: 'sw-resize' };
      const payloadData = [generateData({ x: 20, y: 30 })];
      const state = chartReducer(prev, action({ data: payloadData }));

      expect(state.data).toBe(payloadData);
      expect(state.selectedId).toBe('test-1');
      expect(state.activeHandle).toBe('sw-resize');
    });
  });

  describe('selection', () => {
    it('選取圖形', () => {
      const state = chartReducer(
        initialState,
        chartActions.setSelection({ selectedId: 'test-1', activeHandle: 'sw-resize' })
      );

      expect(state.data).toBe(initialState.data);
      expect(state.selectedId).toBe('test-1');
      expect(state.activeHandle).toBe('sw-resize');
    });

    it('清除選取圖形', () => {
      const prev = { data: [generateData()], selectedId: 'test-1', activeHandle: 'sw-resize' };
      const state = chartReducer(prev, chartActions.clearSelection());

      expect(state.data).toBe(prev.data);
      expect(state.selectedId).toBeNull();
      expect(state.activeHandle).toBe('');
    });
  });

  describe('clear', () => {
    it('清除回初始狀態', () => {
      const prev = { data: [generateData({ x: 10, y: 20 })], selectedId: 'test-2', activeHandle: 's-resize' };
      const state = chartReducer(prev, chartActions.clear());

      expect(state).toEqual(initialState);
    });
  });
});
