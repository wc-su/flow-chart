import { describe, it, expect, vi } from 'vitest';
import chartReducer, { chartActions } from './chartSlice';
import { SHAPE_TYPE } from '@/utils/shape';

vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

const initialState = {
  shapes: [],
  selectedId: null,
  activeHandle: '',
};

const generateShape = (replace) => {
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
    type: SHAPE_TYPE.TERMINAL,
    style: {
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
      const prev = { shapes: [], selectedId: 'test-3', activeHandle: 'nw-resize' };
      const newShapes = [generateShape()];
      const state = chartReducer(prev, chartActions.init({ shapes: newShapes }));

      expect(state.shapes).toBe(newShapes);
      expect(state.selectedId).toBeNull();
      expect(state.activeHandle).toBe('');
    });
  });

  describe('deleteShape', () => {
    it('刪除 shape，並清除選取狀態', () => {
      const keep = generateShape({ id: 'keep' });
      const remove = generateShape({ id: 'remove' });
      const prev = {
        shapes: [keep, remove],
        selectedId: 'remove',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.deleteShape());

      expect(state.shapes).toEqual([keep]);
      expect(state.selectedId).toBeNull();
    });
  });

  describe('startDraw', () => {
    it('prepare 產生的 payload', () => {
      const action = chartActions.startDraw(10, 20, SHAPE_TYPE.PROCESS);

      expect(action.payload).toEqual({ id: 'test-uuid', x: 10, y: 20, drawType: SHAPE_TYPE.PROCESS });
    });

    it('畫出新圖形的第一步', () => {
      const prev = { shapes: [], selectedId: 'test-1', activeHandle: 'se-resize' };
      const state = chartReducer(prev, chartActions.startDraw(10, 20, SHAPE_TYPE.PROCESS));

      expect(state.shapes[0]).toEqual(
        generateShape({ startX: 10, startY: 20, endX: 10, endY: 20, x: 10, y: 20, type: SHAPE_TYPE.PROCESS })
      );
      expect(state.shapes).toHaveLength(1);
      expect(state.selectedId).toBe(prev.selectedId);
      expect(state.activeHandle).toBe(prev.activeHandle);
    });

    it('已有舊資料，畫出新圖形的第一步', () => {
      const prev = { shapes: [generateShape()], selectedId: 'test-2', activeHandle: 'n-resize' };
      const state = chartReducer(prev, chartActions.startDraw(10, 30, 'decision'));

      expect(state.shapes[0]).toBe(prev.shapes[0]);
      expect(state.selectedId).toBe(prev.selectedId);
      expect(state.activeHandle).toBe(prev.activeHandle);
      expect(state.shapes[1]).toEqual(
        generateShape({ startX: 10, startY: 30, endX: 10, endY: 30, x: 10, y: 30, type: 'decision' })
      );
      expect(state.shapes).toHaveLength(2);
    });
  });

  describe('繪畫', () => {
    it('畫圖中，滑鼠往右下 -> 結束畫圖', () => {
      // 起始畫布位置 10, 20
      const prevPosition = { startX: 10, startY: 20, x: 10, y: 20, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 200
      const input = { x: 100, y: 200 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(10);
      expect(shape.startY).toBe(20);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(200);
      expect(shape.x).toBe(10);
      expect(shape.y).toBe(20);
      expect(shape.width).toBe(90);
      expect(shape.height).toBe(180);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(10);
      expect(endShape.startY).toBe(20);
      expect(endShape.endX).toBe(100);
      expect(endShape.endY).toBe(200);
      expect(endShape.x).toBe(10);
      expect(endShape.y).toBe(20);
      expect(endShape.width).toBe(90);
      expect(endShape.height).toBe(180);
    });

    it('畫圖中，滑鼠往右上 -> 結束畫圖', () => {
      // 起始畫布位置 10, 500
      const prevPosition = { startX: 10, startY: 500, x: 10, y: 500, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 200
      const input = { x: 100, y: 200 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(10);
      expect(shape.startY).toBe(500);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(200);
      expect(shape.x).toBe(10);
      expect(shape.y).toBe(200);
      expect(shape.width).toBe(90);
      expect(shape.height).toBe(300);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(10);
      expect(endShape.startY).toBe(200);
      expect(endShape.endX).toBe(100);
      expect(endShape.endY).toBe(500);
      expect(endShape.x).toBe(10);
      expect(endShape.y).toBe(200);
      expect(endShape.width).toBe(90);
      expect(endShape.height).toBe(300);
    });

    it('畫圖中，滑鼠往左上 -> 結束畫圖', () => {
      // 起始畫布位置 400, 500
      const prevPosition = { startX: 400, startY: 500, x: 400, y: 500, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 200
      const input = { x: 100, y: 200 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(400);
      expect(shape.startY).toBe(500);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(200);
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(200);
      expect(shape.width).toBe(300);
      expect(shape.height).toBe(300);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(100);
      expect(endShape.startY).toBe(200);
      expect(endShape.endX).toBe(400);
      expect(endShape.endY).toBe(500);
      expect(endShape.x).toBe(100);
      expect(endShape.y).toBe(200);
      expect(endShape.width).toBe(300);
      expect(endShape.height).toBe(300);
    });

    it('畫圖中，滑鼠往左下 -> 結束畫圖', () => {
      // 起始畫布位置 400, 100
      const prevPosition = { startX: 400, startY: 100, x: 400, y: 100, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 500
      const input = { x: 100, y: 500 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(400);
      expect(shape.startY).toBe(100);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(500);
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(100);
      expect(shape.width).toBe(300);
      expect(shape.height).toBe(400);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(100);
      expect(endShape.startY).toBe(100);
      expect(endShape.endX).toBe(400);
      expect(endShape.endY).toBe(500);
      expect(endShape.x).toBe(100);
      expect(endShape.y).toBe(100);
      expect(endShape.width).toBe(300);
      expect(endShape.height).toBe(400);
    });

    it('畫線中，滑鼠往右下 -> 結束畫線', () => {
      // 起始畫布位置 10, 20
      const prevPosition = { startX: 10, startY: 20, x: 10, y: 20, type: SHAPE_TYPE.FLOWLINE, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 200
      const input = { x: 100, y: 200 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(10);
      expect(shape.startY).toBe(20);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(200);
      expect(shape.x).toBe(10);
      expect(shape.y).toBe(20);
      expect(shape.width).toBe(90);
      expect(shape.height).toBe(180);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(10);
      expect(endShape.startY).toBe(20);
      expect(endShape.endX).toBe(100);
      expect(endShape.endY).toBe(200);
      expect(endShape.x).toBe(10);
      expect(endShape.y).toBe(20);
      expect(endShape.width).toBe(90);
      expect(endShape.height).toBe(180);
    });

    it('畫線中，滑鼠往右上 -> 結束畫線', () => {
      // 起始畫布位置 10, 500
      const prevPosition = { startX: 10, startY: 500, x: 10, y: 500, type: SHAPE_TYPE.FLOWLINE, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 200
      const input = { x: 100, y: 200 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(10);
      expect(shape.startY).toBe(500);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(200);
      expect(shape.x).toBe(10);
      expect(shape.y).toBe(200);
      expect(shape.width).toBe(90);
      expect(shape.height).toBe(300);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(10);
      expect(endShape.startY).toBe(500);
      expect(endShape.endX).toBe(100);
      expect(endShape.endY).toBe(200);
      expect(endShape.x).toBe(10);
      expect(endShape.y).toBe(200);
      expect(endShape.width).toBe(90);
      expect(endShape.height).toBe(300);
    });

    it('畫線中，滑鼠往左上 -> 結束畫線', () => {
      // 起始畫布位置 400, 500
      const prevPosition = { startX: 400, startY: 500, x: 400, y: 500, type: SHAPE_TYPE.FLOWLINE, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 200
      const input = { x: 100, y: 200 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(400);
      expect(shape.startY).toBe(500);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(200);
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(200);
      expect(shape.width).toBe(300);
      expect(shape.height).toBe(300);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(400);
      expect(endShape.startY).toBe(500);
      expect(endShape.endX).toBe(100);
      expect(endShape.endY).toBe(200);
      expect(endShape.x).toBe(100);
      expect(endShape.y).toBe(200);
      expect(endShape.width).toBe(300);
      expect(endShape.height).toBe(300);
    });

    it('畫線中，滑鼠往左下 -> 結束畫線', () => {
      // 起始畫布位置 400, 100
      const prevPosition = { startX: 400, startY: 100, x: 400, y: 100, type: SHAPE_TYPE.FLOWLINE, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 500
      const input = { x: 100, y: 500 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(400);
      expect(shape.startY).toBe(100);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(500);
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(100);
      expect(shape.width).toBe(300);
      expect(shape.height).toBe(400);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(400);
      expect(endShape.startY).toBe(100);
      expect(endShape.endX).toBe(100);
      expect(endShape.endY).toBe(500);
      expect(endShape.x).toBe(100);
      expect(endShape.y).toBe(100);
      expect(endShape.width).toBe(300);
      expect(endShape.height).toBe(400);
    });

    it('畫線中，滑鼠水平往左 -> 結束畫線', () => {
      // 起始畫布位置 400, 100
      const prevPosition = { startX: 400, startY: 100, x: 400, y: 100, type: SHAPE_TYPE.FLOWLINE, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 100, 100
      const input = { x: 100, y: 100 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(400);
      expect(shape.startY).toBe(100);
      expect(shape.endX).toBe(100);
      expect(shape.endY).toBe(100);
      expect(shape.x).toBe(100);
      expect(shape.y).toBe(100);
      expect(shape.width).toBe(300);
      expect(shape.height).toBe(0);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(400);
      expect(endShape.startY).toBe(100);
      expect(endShape.endX).toBe(100);
      expect(endShape.endY).toBe(100);
      expect(endShape.x).toBe(100);
      expect(endShape.y).toBe(100);
      expect(endShape.width).toBe(300);
      expect(endShape.height).toBe(0);
    });

    it('畫線中，滑鼠垂直往下 -> 結束畫線', () => {
      // 起始畫布位置 400, 100
      const prevPosition = { startX: 400, startY: 100, x: 400, y: 100, type: SHAPE_TYPE.FLOWLINE, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 400, 600
      const input = { x: 400, y: 600 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.startX).toBe(400);
      expect(shape.startY).toBe(100);
      expect(shape.endX).toBe(400);
      expect(shape.endY).toBe(600);
      expect(shape.x).toBe(400);
      expect(shape.y).toBe(100);
      expect(shape.width).toBe(0);
      expect(shape.height).toBe(500);

      const endState = chartReducer(state, chartActions.endDraw({ id: 'test-uuid-1' }));
      const endShape = endState.shapes[0];
      expect(endShape.startX).toBe(400);
      expect(endShape.startY).toBe(100);
      expect(endShape.endX).toBe(400);
      expect(endShape.endY).toBe(600);
      expect(endShape.x).toBe(400);
      expect(endShape.y).toBe(100);
      expect(endShape.width).toBe(0);
      expect(endShape.height).toBe(500);
    });

    it('endDraw 會選取傳入指定 id 的圖形', () => {
      const prev = {
        shapes: [
          generateShape({ id: 'init-id' }),
          generateShape({ id: 'test-1', startX: 10, startY: 20, endX: 100, endY: 200, x: 10, y: 20 }),
        ],
        selectedId: '',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.endDraw({ id: 'test-1' }));

      expect(state.selectedId).toBe('test-1');
    });

    it('endDraw 只會異動傳入指定 id 的圖形：整理座標，start 在左上，end 在右下', () => {
      const prev = {
        shapes: [
          generateShape({ id: 'init-id' }),
          generateShape({ id: 'test-1', startX: 100, startY: 200, endX: 10, endY: 20, x: 10, y: 20 }),
        ],
        selectedId: '',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.endDraw({ id: 'test-1' }));

      expect(state.shapes[0]).toBe(prev.shapes[0]);
      expect(state.shapes[1].startX).toBe(10);
      expect(state.shapes[1].startY).toBe(20);
      expect(state.shapes[1].endX).toBe(100);
      expect(state.shapes[1].endY).toBe(200);
    });

    it('endDraw 指定 id 的線，不會整理座標', () => {
      const prev = {
        shapes: [
          generateShape({ id: 'init-id' }),
          generateShape({
            id: 'test-1',
            startX: 100,
            startY: 200,
            endX: 10,
            endY: 20,
            x: 10,
            y: 20,
            type: SHAPE_TYPE.FLOWLINE,
          }),
        ],
        selectedId: '',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.endDraw({ id: 'test-1' }));

      expect(state.shapes).toBe(prev.shapes);
    });

    it('endDraw 會清除控制點', () => {
      const prev = {
        shapes: [
          generateShape({ id: 'init-id' }),
          generateShape({ id: 'test-1', startX: 10, startY: 20, endX: 101, endY: 200, x: 10, y: 20 }),
        ],
        selectedId: 'test-1',
        activeHandle: 'se-resize',
      };
      const state = chartReducer(prev, chartActions.endDraw({ id: 'test-1' }));

      expect(state.activeHandle).toBe('');
    });

    it('cancelDraw 移除最後一筆', () => {
      const prev = {
        shapes: [
          generateShape({ id: 'init-id' }),
          generateShape({ id: 'test-1', startX: 10, startY: 20, endX: 100, endY: 200, x: 10, y: 20 }),
          generateShape({ id: 'test-2', startX: 500, startY: 400, endX: 100, endY: 200, x: 100, y: 200 }),
        ],
        selectedId: 'test-1',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.cancelDraw());

      expect(state.shapes.map((shape) => shape.id)).toEqual(['init-id', 'test-1']);
      expect(state.selectedId).toBe(prev.selectedId);
    });

    it('畫圖中，寬高不滿 24', () => {
      // 起始畫布位置 10, 20
      const prevPosition = { startX: 10, startY: 20, x: 10, y: 20, id: 'test-uuid-1' };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 20, 30
      const input = { x: 20, y: 30 };
      const state = chartReducer(prev, chartActions.draw(input));

      const shape = state.shapes[0];
      expect(shape.endX).toBe(34);
      expect(shape.endY).toBe(44);
      expect(shape.width).toBe(24);
      expect(shape.height).toBe(24);
    });

    it('畫線中，長度不滿 24', () => {
      // 起始畫布位置 10, 20
      const prevPosition = { startX: 10, startY: 20, x: 10, y: 20, id: 'test-uuid-1', type: SHAPE_TYPE.FLOWLINE };
      const prev = { shapes: [generateShape(prevPosition)], selectedId: '', activeHandle: '' };
      // 滑鼠移到畫布位置 13, 24
      const input = { x: 13, y: 24 };
      const state = chartReducer(prev, chartActions.draw(input));

      // 長度 5，倍數 24 / 5 = 4.8：3 × 4.8 = 14.4、4 × 4.8 = 19.2
      const shape = state.shapes[0];
      expect(shape.x).toBe(10);
      expect(shape.y).toBe(20);
      expect(shape.endX).toBeCloseTo(24.4);
      expect(shape.endY).toBeCloseTo(39.2);
      expect(shape.width).toBeCloseTo(14.4);
      expect(shape.height).toBeCloseTo(19.2);
    });

    it('拖曳圖形', () => {
      const initShape = generateShape({
        id: 'test-2',
        x: 200,
        y: 350,
        startX: 200,
        startY: 350,
        endX: 400,
        endY: 600,
        width: 200,
        height: 250,
      });
      const prev = {
        shapes: [
          generateShape({
            id: 'test-1',
            x: 10,
            y: 20,
            startX: 10,
            startY: 20,
            endX: 200,
            endY: 250,
            width: 190,
            height: 230,
          }),
          initShape,
        ],
        selectedId: 'test-2',
        activeHandle: '',
      };
      const moveState = chartReducer(prev, chartActions.moveShape({ initShape, distanceX: 100, distanceY: 150 }));

      const compare = generateShape({
        id: 'test-2',
        x: 300,
        y: 500,
        startX: 300,
        startY: 500,
        endX: 500,
        endY: 750,
        width: 200,
        height: 250,
      });
      expect(moveState.shapes[0]).toBe(prev.shapes[0]);
      expect(moveState.shapes[1]).toEqual(compare);

      const endState = chartReducer(moveState, chartActions.endDraw({ id: 'test-2' }));

      expect(endState.shapes[1]).toEqual(compare);
      expect(endState.selectedId).toBe('test-2');
    });
  });

  describe('startResize', () => {
    it('nw，互換 x, y 位置，固定點為右下', () => {
      const prev = {
        shapes: [
          generateShape({ id: 'test-1' }),
          generateShape({ id: 'test-2', startX: 100, startY: 50, endX: 300, endY: 200 }),
        ],
        selectedId: 'test-2',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.startResize({ id: 'test-2', activeHandle: 'nw-resize' }));

      expect(state.shapes[0]).toBe(prev.shapes[0]);
      expect(state.shapes[1]).toEqual(generateShape({ id: 'test-2', startX: 300, startY: 200, endX: 100, endY: 50 }));
      expect(state.activeHandle).toBe('nw-resize');
    });

    it('n，互換 y 位置，固定點為左下', () => {
      const prev = {
        shapes: [generateShape({ id: 'test-1', startX: 50, startY: 250, endX: 350, endY: 350 })],
        selectedId: 'test-1',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: 'n-resize' }));

      expect(state.shapes[0]).toEqual(generateShape({ id: 'test-1', startX: 50, startY: 350, endX: 350, endY: 250 }));
      expect(state.activeHandle).toBe('n-resize');
    });

    it('ne，互換 y 位置，固定點為左下', () => {
      const prev = {
        shapes: [generateShape({ id: 'test-1', startX: 150, startY: 100, endX: 400, endY: 380 })],
        selectedId: 'test-1',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: 'ne-resize' }));

      expect(state.shapes[0]).toEqual(generateShape({ id: 'test-1', startX: 150, startY: 380, endX: 400, endY: 100 }));
      expect(state.activeHandle).toBe('ne-resize');
    });

    it('w，互換 x 位置，固定點為右上', () => {
      const prev = {
        shapes: [generateShape({ id: 'test-1', startX: 180, startY: 50, endX: 320, endY: 120 })],
        selectedId: 'test-1',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: 'w-resize' }));

      expect(state.shapes[0]).toEqual(generateShape({ id: 'test-1', startX: 320, startY: 50, endX: 180, endY: 120 }));
      expect(state.activeHandle).toBe('w-resize');
    });

    it('sw，互換 x 位置，固定點為右上', () => {
      const prev = {
        shapes: [generateShape({ id: 'test-1', startX: 120, startY: 180, endX: 300, endY: 300 })],
        selectedId: 'test-1',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: 'sw-resize' }));

      expect(state.shapes[0]).toEqual(generateShape({ id: 'test-1', startX: 300, startY: 180, endX: 120, endY: 300 }));
      expect(state.activeHandle).toBe('sw-resize');
    });

    it.each([
      ['e，不變', 'e-resize', 120, 100, 200, 350],
      ['s，不變', 's-resize', 150, 300, 450, 400],
      ['se，不變', 'se-resize', 50, 100, 300, 350],
      ['start，不變', 'start-resize', 100, 100, 200, 300],
      ['end，不變', 'end-resize', 300, 400, 50, 60],
    ])('%s', (_, handle, startX, startY, endX, endY) => {
      const prev = {
        shapes: [generateShape({ id: 'test-1', startX, startY, endX, endY })],
        selectedId: 'test-1',
        activeHandle: '',
      };
      const state = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: handle }));

      expect(state.shapes[0]).toBe(prev.shapes[0]);
      expect(state.activeHandle).toBe(handle);
    });
  });

  describe('resizeShape', () => {
    it('圖形縮放中', () => {
      const prev = {
        shapes: [
          generateShape({
            id: 'test-1',
            startX: 120,
            startY: 180,
            endX: 300,
            endY: 350,
            x: 120,
            y: 180,
            width: 180,
            height: 170,
          }),
        ],
        selectedId: 'test-1',
        activeHandle: 'se-resize',
      };
      const state = chartReducer(prev, chartActions.resizeShape({ x: 400, y: 450 }));

      expect(state.shapes[0].endX).toBe(400);
      expect(state.shapes[0].endY).toBe(450);
      expect(state.shapes[0].width).toBe(280);
      expect(state.shapes[0].height).toBe(270);
      // 不會異動 selectedId, activeHandle
      expect(state.selectedId).toBe(prev.selectedId);
      expect(state.activeHandle).toBe(prev.activeHandle);
    });

    it('縮放圖形，滑鼠位置距離固定點寬高小於 24', () => {
      const prev = {
        shapes: [
          generateShape({
            id: 'test-1',
            x: 150,
            y: 100,
            startX: 150,
            startY: 100,
            endX: 200,
            endY: 250,
            width: 50,
            height: 150,
          }),
        ],
        selectedId: 'test-1',
        activeHandle: 'se-resize',
      };
      const moveState = chartReducer(prev, chartActions.resizeShape({ x: 160, y: 110 }));

      expect(moveState.shapes[0].x).toBe(150);
      expect(moveState.shapes[0].y).toBe(100);
      expect(moveState.shapes[0].endX).toBe(174);
      expect(moveState.shapes[0].endY).toBe(124);
      expect(moveState.shapes[0].width).toBe(24);
      expect(moveState.shapes[0].height).toBe(24);
    });

    it('縮放線，滑鼠位置距離固定點長度小於 24', () => {
      const prev = {
        shapes: [
          generateShape({
            id: 'test-1',
            x: 150,
            y: 100,
            startX: 150,
            startY: 100,
            endX: 200,
            endY: 250,
            width: 50,
            height: 150,
            type: SHAPE_TYPE.FLOWLINE,
          }),
        ],
        selectedId: 'test-1',
        activeHandle: 'start-resize',
      };
      const moveState = chartReducer(prev, chartActions.resizeShape({ x: 196, y: 247 }));

      // 長度 5，倍數 24 / 5 = 4.8：4 × 4.8 = 19.2、3 × 4.8 = 14.4
      expect(moveState.shapes[0].x).toBeCloseTo(180.8);
      expect(moveState.shapes[0].y).toBeCloseTo(235.6);
      expect(moveState.shapes[0].endX).toBe(200);
      expect(moveState.shapes[0].endY).toBe(250);
      expect(moveState.shapes[0].width).toBeCloseTo(19.2);
      expect(moveState.shapes[0].height).toBeCloseTo(14.4);
    });
  });

  describe('normalizeShape', () => {
    it('圖形的控制點選擇右下，滑鼠移動位置和終點相同', () => {
      const prev = {
        shapes: [
          generateShape({
            id: 'test-1',
            startX: 120,
            startY: 180,
            endX: 300,
            endY: 350,
            x: 120,
            y: 180,
            width: 180,
            height: 170,
          }),
        ],
        selectedId: 'test-1',
        activeHandle: '',
      };
      const startState = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: 'se-resize' }));
      const resizeState = chartReducer(startState, chartActions.resizeShape({ x: 300, y: 350 }));
      const normalizeState = chartReducer(resizeState, chartActions.normalizeShape({ id: 'test-1' }));

      expect(normalizeState.shapes).toEqual(prev.shapes);
      expect(normalizeState.selectedId).toBe(prev.selectedId);
      expect(normalizeState.activeHandle).toBe('');
    });

    it('圖形控制點選擇左上，滑鼠移動位置和終點相同', () => {
      const prev = {
        shapes: [
          generateShape({
            id: 'test-1',
            startX: 120,
            startY: 180,
            endX: 300,
            endY: 350,
            x: 120,
            y: 180,
            width: 180,
            height: 170,
          }),
        ],
        selectedId: 'test-1',
        activeHandle: '',
      };
      // 控制點在 nw，start 和 end 位置互換
      const startState = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: 'nw-resize' }));
      expect(startState.shapes[0].startX).toBe(300);
      expect(startState.shapes[0].startY).toBe(350);
      expect(startState.shapes[0].endX).toBe(120);
      expect(startState.shapes[0].endY).toBe(180);

      // 圖形最後位置和 endX/Y 相同
      const resizeState = chartReducer(startState, chartActions.resizeShape({ x: 120, y: 180 }));

      const normalizeState = chartReducer(resizeState, chartActions.normalizeShape({ id: 'test-1' }));
      expect(normalizeState.shapes).toEqual(prev.shapes);
      expect(normalizeState.selectedId).toBe(prev.selectedId);
      expect(normalizeState.activeHandle).toBe('');
    });

    it('線的控制點選擇終點，滑鼠移動位置和終點相同', () => {
      const prev = {
        shapes: [
          generateShape({
            id: 'test-1',
            startX: 300,
            startY: 350,
            endX: 120,
            endY: 180,
            x: 120,
            y: 180,
            width: 180,
            height: 170,
            type: SHAPE_TYPE.FLOWLINE,
          }),
        ],
        selectedId: 'test-1',
        activeHandle: '',
      };
      // 控制點在 end，線不會更改 start, end
      const startState = chartReducer(prev, chartActions.startResize({ id: 'test-1', activeHandle: 'end-resize' }));
      expect(startState.shapes).toBe(prev.shapes);

      // 圖形最後位置和 endX/Y 相同
      const resizeState = chartReducer(startState, chartActions.resizeShape({ x: 120, y: 180 }));

      const normalizeState = chartReducer(resizeState, chartActions.normalizeShape({ id: 'test-1' }));
      expect(normalizeState.shapes).toEqual(prev.shapes);
      expect(normalizeState.selectedId).toBe(prev.selectedId);
      expect(normalizeState.activeHandle).toBe('');
    });
  });

  describe('selection', () => {
    it('選取圖形', () => {
      const state = chartReducer(
        initialState,
        chartActions.setSelection({ selectedId: 'test-1', activeHandle: 'sw-resize' })
      );

      expect(state.shapes).toBe(initialState.shapes);
      expect(state.selectedId).toBe('test-1');
      expect(state.activeHandle).toBe('sw-resize');
    });

    it('清除選取圖形', () => {
      const prev = { shapes: [generateShape()], selectedId: 'test-1', activeHandle: 'sw-resize' };
      const state = chartReducer(prev, chartActions.clearSelection());

      expect(state.shapes).toBe(prev.shapes);
      expect(state.selectedId).toBeNull();
      expect(state.activeHandle).toBe('');
    });
  });

  describe('clear', () => {
    it('清除回初始狀態', () => {
      const prev = { shapes: [generateShape({ x: 10, y: 20 })], selectedId: 'test-2', activeHandle: 's-resize' };
      const state = chartReducer(prev, chartActions.clear());

      expect(state).toEqual(initialState);
    });
  });
});
