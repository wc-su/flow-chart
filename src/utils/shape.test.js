import { describe, expect, it } from 'vitest';
import { SHAPE_TYPE, createShape, buildSelectionOverlay, isEmptyShape, normalizeBox, toCanvasPoint } from './shape';

const testShapes = [
  // 開新檔 init 時放入的佔位資料，只有 id
  { id: 'test-uuid-init' },
  {
    id: 'test-uuid-terminal',
    startX: 10,
    startY: 20,
    endX: 110,
    endY: 70,
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    type: 'terminal',
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
  },
  {
    id: 'test-uuid-terminal-resizing',
    startX: 110,
    startY: 70,
    endX: 10,
    endY: 20,
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    type: 'terminal',
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
  },
  {
    id: 'test-uuid-flowline',
    startX: 50,
    startY: 60,
    endX: 150,
    endY: 100,
    x: 50,
    y: 60,
    width: 100,
    height: 40,
    type: 'flowline',
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
  },
  {
    id: 'test-uuid-flowline-reverse',
    startX: 150,
    startY: 100,
    endX: 50,
    endY: 60,
    x: 50,
    y: 60,
    width: 100,
    height: 40,
    type: 'flowline',
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
  },
];

describe('createShape: 繪製新圖形的第一步', () => {
  it('畫圖 terminal', () => {
    const input = { id: 'test-uuid', x: 0, y: 1, drawType: SHAPE_TYPE.TERMINAL };
    const obj = createShape(input);

    expect(obj.id).toBe(input.id);
    expect(obj.type).toBe(input.drawType);
    expect(obj.startX).toBe(input.x);
    expect(obj.startY).toBe(input.y);
    expect(obj.endX).toBe(input.x);
    expect(obj.endY).toBe(input.y);
    expect(obj.x).toBe(input.x);
    expect(obj.y).toBe(input.y);
    expect(obj.width).toBe(0);
    expect(obj.height).toBe(0);
  });
});

describe('buildSelectionOverlay: 產生圖形選取框、控制點 (線沒有選取框)', () => {
  it('沒有選取圖形：回傳空陣列', () => {
    const output = buildSelectionOverlay(testShapes, null, '');

    expect(output).toEqual([]);
  });

  it('找不到圖形：回傳空陣列', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-unknown', '');

    expect(output).toEqual([]);
  });

  it('一般圖形：回傳選取框 + 8 個控制點', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-terminal', '');

    expect(output).toHaveLength(9);
    // 取得選取框
    const selectionBox = output[0];
    expect(selectionBox.type).toBe('process');
    expect(selectionBox.style).toMatchObject({ stroke: '#00a8ff', strokeDasharray: '3' });
    // 取得控制點，確認 id, cursor, x, y
    const handles = output.slice(1).map(({ id, cursor, x, y }) => ({ id, cursor, x, y }));
    expect(handles).toEqual([
      { id: 'test-uuid-terminal:nw-resize', cursor: 'nw-resize', x: 10, y: 20 },
      { id: 'test-uuid-terminal:n-resize', cursor: 'n-resize', x: 60, y: 20 },
      { id: 'test-uuid-terminal:ne-resize', cursor: 'ne-resize', x: 110, y: 20 },
      { id: 'test-uuid-terminal:w-resize', cursor: 'w-resize', x: 10, y: 45 },
      { id: 'test-uuid-terminal:e-resize', cursor: 'e-resize', x: 110, y: 45 },
      { id: 'test-uuid-terminal:sw-resize', cursor: 'sw-resize', x: 10, y: 70 },
      { id: 'test-uuid-terminal:s-resize', cursor: 's-resize', x: 60, y: 70 },
      { id: 'test-uuid-terminal:se-resize', cursor: 'se-resize', x: 110, y: 70 },
    ]);
    // 選取框不可選取，但控制點可選取
    expect(selectionBox.pointerEvents).toBe('none');
    const pointerEvents = output.slice(1).map((item) => item.pointerEvents);
    expect(pointerEvents).toEqual(Array(8).fill('all'));
  });

  it('一般圖形拖左上控制點縮放中 (start 是右下的固定點): 顯示的控制點在滑鼠位置', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-terminal-resizing', 'nw-resize');

    expect(output).toHaveLength(9);

    // 只有 nw-resize 的控制點為顯示，選取框以及其他控制點不顯示
    const visible = output.filter((item) => item.display === 'block');
    expect(visible).toHaveLength(1);
    expect(visible[0]).toMatchObject({ cursor: 'nw-resize', x: 10, y: 20 });
  });

  it('不會改到傳進去的 shapes', () => {
    // structuredClone 是瀏覽器和 Node 內建的深拷貝函式
    const before = structuredClone(testShapes);

    buildSelectionOverlay(testShapes, 'test-uuid-terminal-resizing', 'nw-resize');

    // 不會改到傳進去的 shapes
    expect(testShapes).toEqual(before);
  });

  it('flowline: 回傳起點、終點', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-flowline', '');

    expect(output).toHaveLength(2);
    // 取得控制點，確認 id, cursor, x, y
    const handles = output.map(({ id, cursor, x, y }) => ({ id, cursor, x, y }));
    expect(handles).toEqual([
      { id: 'test-uuid-flowline:start-resize', cursor: 'start-resize', x: 50, y: 60 },
      { id: 'test-uuid-flowline:end-resize', cursor: 'end-resize', x: 150, y: 100 },
    ]);

    // 皆可選取
    const pointerEvents = output.map((item) => item.pointerEvents);
    expect(pointerEvents).toEqual(Array(2).fill('all'));
  });

  it('flowline 反向畫，座標不會被整理，控制點依線的方向繪製', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-flowline-reverse', '');

    expect(output).toHaveLength(2);
    // 取得控制點，確認 id, cursor, x, y
    const handles = output.map(({ id, cursor, x, y }) => ({ id, cursor, x, y }));
    expect(handles).toEqual([
      { id: 'test-uuid-flowline-reverse:start-resize', cursor: 'start-resize', x: 150, y: 100 },
      { id: 'test-uuid-flowline-reverse:end-resize', cursor: 'end-resize', x: 50, y: 60 },
    ]);
  });

  it('flowline 拖曳起點：只顯示起點', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-flowline', 'start-resize');

    expect(output).toHaveLength(2);
    // 只有 start-resize 的控制點為顯示，另一個控制點不顯示
    const visible = output.filter((item) => item.display === 'block').map((item) => item.cursor);
    expect(visible).toEqual(['start-resize']);
  });
});

describe('isEmptyShape: 檢驗是否為無效圖形', () => {
  it.each([
    ['一般圖形寬高皆大於等於 24，要保留', SHAPE_TYPE.PROCESS, 24, 24, false],
    ['一般圖形寬小於 24，不保留', SHAPE_TYPE.INPUTOUTPUT, 23, 100, true],
    ['一般圖形高小於 24，不保留', SHAPE_TYPE.DECISION, 100, 23, true],
    ['只點一下，不保留', SHAPE_TYPE.DECISION, 0, 0, true],
    ['水平線長度超過 24 要保留', SHAPE_TYPE.FLOWLINE, 300, 0, false],
    ['垂直線長度大於等於 24，要保留', SHAPE_TYPE.FLOWLINE, 0, 24, false],
    ['垂直線長度小於 24，不保留', SHAPE_TYPE.FLOWLINE, 0, 23, true],
    ['斜線長度大於等於 24，要保留', SHAPE_TYPE.FLOWLINE, 15, 20, false],
    ['斜線長度小於 24，不保留', SHAPE_TYPE.FLOWLINE, 12, 16, true],
  ])('%s', (_, type, width, height, expected) => {
    const res = isEmptyShape(type, width, height);

    expect(res).toBe(expected);
  });
});

describe('normalizeBox: 把 start、end 整理成 start 在左上、end 在右下', () => {
  it('start、end 本來就是左上到右下', () => {
    const res = normalizeBox({ startX: 10, startY: 20, endX: 100, endY: 200 });

    expect(res.startX).toBe(10);
    expect(res.startY).toBe(20);
    expect(res.endX).toBe(100);
    expect(res.endY).toBe(200);
  });

  it('start 是右下、end 是左上，兩個位置交換', () => {
    const res = normalizeBox({ startX: 400, startY: 500, endX: 100, endY: 200 });

    expect(res.startX).toBe(100);
    expect(res.startY).toBe(200);
    expect(res.endX).toBe(400);
    expect(res.endY).toBe(500);
  });

  it('start 是左下、end 是右上，只有 y 會交換', () => {
    const res = normalizeBox({ startX: 10, startY: 500, endX: 100, endY: 200 });

    expect(res.startX).toBe(10);
    expect(res.startY).toBe(200);
    expect(res.endX).toBe(100);
    expect(res.endY).toBe(500);
  });

  it('直接傳整個物件也是可以的', () => {
    const shape = {
      id: 'test-uuid',
      startX: 10,
      startY: 500,
      endX: 100,
      endY: 200,
      x: 10,
      y: 200,
      width: 90,
      height: 300,
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
    };
    const res = normalizeBox(shape);

    expect(res).toEqual({ startX: 10, startY: 200, endX: 100, endY: 500 });
  });
});

describe('toCanvasPoint: 滑鼠座標轉換成在畫布上的座標', () => {
  const rect = { left: 100, top: 50 };
  it('基本換算', () => {
    const res = toCanvasPoint({ clientX: 150, clientY: 80, rect, rate: 1 });

    expect(res.x).toBe(50);
    expect(res.y).toBe(30);
  });

  it('放大 200% 時除以倍率', () => {
    const res = toCanvasPoint({ clientX: 150, clientY: 80, rect, rate: 2 });

    expect(res.x).toBe(25);
    expect(res.y).toBe(15);
  });
});
