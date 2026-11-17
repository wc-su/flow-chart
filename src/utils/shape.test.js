import { describe, expect, it } from 'vitest';
import {
  SHAPE_TYPE,
  createShape,
  buildSelectionOverlay,
  isEmptyShape,
  normalizeBox,
  toCanvasPoint,
  getMovedShape,
  isSameShape,
  getResizingBox,
  isEqualShape,
} from './shape';

const generateShape = ({ startX, startY, endX, endY, x, y, type, ...rest }) => ({
  id: 'test-uuid',
  startX: startX,
  startY: startY,
  endX: endX,
  endY: endY,
  x: x,
  y: y,
  width: Math.abs(endX - startX),
  height: Math.abs(endY - startY),
  type: type,
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
  ...rest,
});

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

describe('getMovedShape: 拖曳圖形', () => {
  it('往右下移動', () => {
    const initShape = generateShape({
      x: 100,
      y: 200,
      startX: 100,
      startY: 200,
      endX: 200,
      endY: 300,
      type: SHAPE_TYPE.TERMINAL,
    });
    const result = getMovedShape({ initShape, distanceX: 5, distanceY: 1 });

    expect(result).toEqual({ x: 105, y: 201, startX: 105, startY: 201, endX: 205, endY: 301 });
  });

  it('往左上移動', () => {
    const initShape = generateShape({
      x: 102,
      y: 107,
      startX: 102,
      startY: 107,
      endX: 150,
      endY: 200,
      type: SHAPE_TYPE.TERMINAL,
    });
    const result = getMovedShape({ initShape, distanceX: -2, distanceY: -7 });

    expect(result).toEqual({ x: 100, y: 100, startX: 100, startY: 100, endX: 148, endY: 193 });
  });

  it('線會保留方向', () => {
    const initShape = generateShape({
      x: 100,
      y: 100,
      startX: 300,
      startY: 200,
      endX: 100,
      endY: 100,
      type: SHAPE_TYPE.FLOWLINE,
    });
    const result = getMovedShape({ initShape, distanceX: 10, distanceY: 10 });

    expect(result).toEqual({ x: 110, y: 110, startX: 310, startY: 210, endX: 110, endY: 110 });
  });

  it('往左拖到 x 會變成 −30', () => {
    const initShape = generateShape({
      x: 100,
      y: 100,
      startX: 100,
      startY: 100,
      endX: 300,
      endY: 200,
      type: SHAPE_TYPE.TERMINAL,
    });

    const result = getMovedShape({ initShape, distanceX: -130, distanceY: 50 });

    expect(result).toEqual({ x: 0, y: 150, startX: 0, startY: 150, endX: 200, endY: 250 });
  });

  it('寬 100 的圖形往右拖到 x 會變成 550', () => {
    const initShape = generateShape({
      x: 100,
      y: 150,
      startX: 100,
      startY: 150,
      endX: 200,
      endY: 350,
      type: SHAPE_TYPE.TERMINAL,
    });

    const result = getMovedShape({ initShape, distanceX: 450, distanceY: 0 });

    expect(result).toEqual({ x: 500, y: 150, startX: 500, startY: 150, endX: 600, endY: 350 });
  });
});

describe('isSameShape: 拖曳圖形是否和原本一樣', () => {
  it.each([
    ['圖形位置沒變', { x: 100, y: 100 }, { x: 100, y: 100 }, true],
    ['圖形位置改變', { x: 150, y: 200 }, { x: 300, y: 200 }, false],
    ['只有 y 不同', { x: 150, y: 200 }, { x: 150, y: 300 }, false],
  ])('%s', (_, oldShape, newShape, expected) => {
    const result = isSameShape(oldShape, newShape);

    expect(result).toBe(expected);
  });
});

describe('getResizingBox: 依控制點、圖形、滑鼠位置計算 x, y 和寬高', () => {
  it('nw，更換 endX/Y，x/y, width/height 重算', () => {
    const shape = generateShape({
      x: 100,
      y: 100,
      startX: 300,
      startY: 300,
      endX: 100,
      endY: 100,
      width: 200,
      height: 200,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 'nw-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 150, 150);

    expect(result).toEqual({ x: 150, y: 150, startX: 300, startY: 300, endX: 150, endY: 150, width: 150, height: 150 });
  });

  it('n，endX 不變，y, height 重算', () => {
    const shape = generateShape({
      x: 50,
      y: 250,
      startX: 50,
      startY: 350,
      endX: 350,
      endY: 250,
      width: 300,
      height: 100,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 'n-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 10, 50);

    expect(result).toEqual({ x: 50, y: 50, startX: 50, startY: 350, endX: 350, endY: 50, width: 300, height: 300 });
  });

  it('ne，更換 endX/Y，x/y, width/height 重算', () => {
    const shape = generateShape({
      x: 150,
      y: 100,
      startX: 150,
      startY: 380,
      endX: 400,
      endY: 100,
      width: 250,
      height: 280,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 'ne-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 50, 50);

    expect(result).toEqual({ x: 50, y: 50, startX: 150, startY: 380, endX: 50, endY: 50, width: 100, height: 330 });
  });

  it('w，endY 不變，x, width 重算', () => {
    const shape = generateShape({
      x: 180,
      y: 50,
      startX: 320,
      startY: 50,
      endX: 180,
      endY: 120,
      width: 140,
      height: 70,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 'w-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 120, 100);

    expect(result).toEqual({ x: 120, y: 50, startX: 320, startY: 50, endX: 120, endY: 120, width: 200, height: 70 });
  });

  it('e，endY 不變，x, width 重算', () => {
    const shape = generateShape({
      x: 120,
      y: 100,
      startX: 120,
      startY: 100,
      endX: 200,
      endY: 350,
      width: 80,
      height: 250,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 'e-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 70, 50);

    expect(result).toEqual({ x: 70, y: 100, startX: 120, startY: 100, endX: 70, endY: 350, width: 50, height: 250 });
  });

  it('sw，更換 end，x/y, width/height 重算', () => {
    const shape = generateShape({
      x: 120,
      y: 180,
      startX: 300,
      startY: 180,
      endX: 120,
      endY: 300,
      width: 180,
      height: 120,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 'sw-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 100, 400);

    expect(result).toEqual({ x: 100, y: 180, startX: 300, startY: 180, endX: 100, endY: 400, width: 200, height: 220 });
  });

  it('s，endX 不變，y, height 重算', () => {
    const shape = generateShape({
      x: 150,
      y: 300,
      startX: 150,
      startY: 300,
      endX: 450,
      endY: 400,
      width: 300,
      height: 200,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 's-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 500, 800);

    expect(result).toEqual({ x: 150, y: 300, startX: 150, startY: 300, endX: 450, endY: 800, width: 300, height: 500 });
  });

  it('se，更換 endX/Y，x/y, width/height 重算', () => {
    const shape = generateShape({
      x: 50,
      y: 100,
      startX: 50,
      startY: 100,
      endX: 300,
      endY: 350,
      width: 250,
      height: 250,
      type: SHAPE_TYPE.TERMINAL,
      cursor: 'se-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 350, 350);

    expect(result).toEqual({ x: 50, y: 100, startX: 50, startY: 100, endX: 350, endY: 350, width: 300, height: 250 });
  });

  it('start，更換 startX/Y', () => {
    const shape = generateShape({
      x: 100,
      y: 200,
      startX: 100,
      startY: 200,
      endX: 200,
      endY: 300,
      width: 100,
      height: 100,
      type: SHAPE_TYPE.FLOWLINE,
      cursor: 'start-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 250, 100);

    expect(result).toEqual({ x: 200, y: 100, startX: 250, startY: 100, endX: 200, endY: 300, width: 50, height: 200 });
  });

  it('end，更換 endX/Y', () => {
    const shape = generateShape({
      x: 50,
      y: 60,
      startX: 300,
      startY: 400,
      endX: 50,
      endY: 60,
      width: 250,
      height: 340,
      type: SHAPE_TYPE.FLOWLINE,
      cursor: 'end-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 150, 100);

    expect(result).toEqual({ x: 150, y: 100, startX: 300, startY: 400, endX: 150, endY: 100, width: 150, height: 300 });
  });

  it('Y 方向拖過固定點', () => {
    const shape = generateShape({
      x: 100,
      y: 100,
      startX: 100,
      startY: 100,
      endX: 300,
      endY: 200,
      width: 200,
      height: 100,
      type: SHAPE_TYPE.PROCESS,
      cursor: 'se-resize',
    });
    const result = getResizingBox(shape.cursor, shape, 200, 50);

    expect(result).toEqual({ x: 100, y: 50, startX: 100, startY: 100, endX: 200, endY: 50, width: 100, height: 50 });
  });
});

describe('isEqualShape: 比對新舊圖形起點、終點座標，看圖形是否相同', () => {
  it('含縮放前大小相同', () => {
    const oldShape = generateShape({
      x: 100,
      y: 200,
      startX: 100,
      startY: 200,
      endX: 200,
      endY: 300,
      type: SHAPE_TYPE.INPUTOUTPUT,
    });
    const newShape = { ...oldShape, startX: 100, startY: 200, endX: 200, endY: 300 };
    const result = isEqualShape(oldShape, newShape);

    expect(result).toBe(true);
  });

  it('含縮放前大小不同', () => {
    const oldShape = generateShape({
      x: 100,
      y: 300,
      startX: 100,
      startY: 300,
      endX: 300,
      endY: 500,
      type: SHAPE_TYPE.INPUTOUTPUT,
    });
    const newShape = { ...oldShape, startX: 50, startY: 100, endX: 300, endY: 500 };
    const result = isEqualShape(oldShape, newShape);

    expect(result).toBe(false);
  });

  it('只有 startY 不同', () => {
    const oldShape = generateShape({
      x: 100,
      y: 300,
      startX: 100,
      startY: 300,
      endX: 300,
      endY: 500,
      type: SHAPE_TYPE.INPUTOUTPUT,
    });
    const newShape = { ...oldShape, startX: 100, startY: 100, endX: 300, endY: 500 };
    const result = isEqualShape(oldShape, newShape);

    expect(result).toBe(false);
  });

  it('只有 endX 不同', () => {
    const oldShape = generateShape({
      x: 100,
      y: 300,
      startX: 100,
      startY: 300,
      endX: 300,
      endY: 500,
      type: SHAPE_TYPE.INPUTOUTPUT,
    });
    const newShape = { ...oldShape, startX: 100, startY: 300, endX: 400, endY: 500 };
    const result = isEqualShape(oldShape, newShape);

    expect(result).toBe(false);
  });

  it('只有 endY 不同', () => {
    const oldShape = generateShape({
      x: 100,
      y: 300,
      startX: 100,
      startY: 300,
      endX: 300,
      endY: 500,
      type: SHAPE_TYPE.INPUTOUTPUT,
    });
    const newShape = { ...oldShape, startX: 100, startY: 300, endX: 300, endY: 600 };
    const result = isEqualShape(oldShape, newShape);

    expect(result).toBe(false);
  });

  it('只有 startX 不同', () => {
    const oldShape = generateShape({
      x: 100,
      y: 300,
      startX: 100,
      startY: 300,
      endX: 300,
      endY: 500,
      type: SHAPE_TYPE.INPUTOUTPUT,
    });
    const newShape = { ...oldShape, startX: 50, startY: 300, endX: 300, endY: 500 };
    const result = isEqualShape(oldShape, newShape);

    expect(result).toBe(false);
  });

  it('線的兩端對調，範圍相同但方向不同', () => {
    const oldShape = generateShape({
      x: 100,
      y: 100,
      startX: 100,
      startY: 100,
      endX: 300,
      endY: 300,
      type: SHAPE_TYPE.FLOWLINE,
    });
    const newShape = { ...oldShape, startX: 300, startY: 300, endX: 100, endY: 100 };
    const result = isEqualShape(oldShape, newShape);

    expect(result).toBe(false);
  });
});
