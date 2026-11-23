import { describe, expect, it } from 'vitest';
import {
  SHAPE_TYPE,
  createShape,
  buildSelectionOverlay,
  normalizeBox,
  toCanvasPoint,
  getDrawingBox,
  getMovedShape,
  isSameShape,
  getResizingBox,
  isEqualShape,
  findChangedShape,
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
    // 取得控制點，確認 id, handle, cursor, x, y
    const handles = output.slice(1).map(({ id, handle, cursor, x, y }) => ({ id, handle, cursor, x, y }));
    expect(handles).toEqual([
      { id: 'test-uuid-terminal:nw-resize', handle: 'nw-resize', cursor: 'nw-resize', x: 10, y: 20 },
      { id: 'test-uuid-terminal:n-resize', handle: 'n-resize', cursor: 'n-resize', x: 60, y: 20 },
      { id: 'test-uuid-terminal:ne-resize', handle: 'ne-resize', cursor: 'ne-resize', x: 110, y: 20 },
      { id: 'test-uuid-terminal:w-resize', handle: 'w-resize', cursor: 'w-resize', x: 10, y: 45 },
      { id: 'test-uuid-terminal:e-resize', handle: 'e-resize', cursor: 'e-resize', x: 110, y: 45 },
      { id: 'test-uuid-terminal:sw-resize', handle: 'sw-resize', cursor: 'sw-resize', x: 10, y: 70 },
      { id: 'test-uuid-terminal:s-resize', handle: 's-resize', cursor: 's-resize', x: 60, y: 70 },
      { id: 'test-uuid-terminal:se-resize', handle: 'se-resize', cursor: 'se-resize', x: 110, y: 70 },
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
    expect(visible[0]).toMatchObject({ handle: 'nw-resize', cursor: 'nw-resize', x: 10, y: 20 });
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
    // 取得控制點，確認 id, handle, cursor, x, y
    const handles = output.map(({ id, handle, cursor, x, y }) => ({ id, handle, cursor, x, y }));
    expect(handles).toEqual([
      { id: 'test-uuid-flowline:start-resize', handle: 'start-resize', cursor: 'pointer', x: 50, y: 60 },
      { id: 'test-uuid-flowline:end-resize', handle: 'end-resize', cursor: 'pointer', x: 150, y: 100 },
    ]);

    // 皆可選取
    const pointerEvents = output.map((item) => item.pointerEvents);
    expect(pointerEvents).toEqual(Array(2).fill('all'));
  });

  it('flowline 反向畫，座標不會被整理，控制點依線的方向繪製', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-flowline-reverse', '');

    expect(output).toHaveLength(2);
    // 取得控制點，確認 id, handle, cursor, x, y
    const handles = output.map(({ id, handle, cursor, x, y }) => ({ id, handle, cursor, x, y }));
    expect(handles).toEqual([
      { id: 'test-uuid-flowline-reverse:start-resize', handle: 'start-resize', cursor: 'pointer', x: 150, y: 100 },
      { id: 'test-uuid-flowline-reverse:end-resize', handle: 'end-resize', cursor: 'pointer', x: 50, y: 60 },
    ]);
  });

  it('flowline 拖曳起點：只顯示起點', () => {
    const output = buildSelectionOverlay(testShapes, 'test-uuid-flowline', 'start-resize');

    expect(output).toHaveLength(2);
    // 只有 start-resize 的控制點為顯示，另一個控制點不顯示
    const visible = output.filter((item) => item.display === 'block').map((item) => item.handle);
    expect(visible).toEqual(['start-resize']);
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

describe('getDrawingBox: 依圖形、滑鼠位置計算 x, y 和寬高', () => {
  it('一般圖形：滑鼠位置往右下', () => {
    const result = getDrawingBox(SHAPE_TYPE.DECISION, 10, 15, 200, 250);

    expect(result).toEqual({ x: 10, y: 15, endX: 200, endY: 250, width: 190, height: 235 });
  });

  it('一般圖形：滑鼠 X 位置距離固定點 X 不滿 24', () => {
    const result = getDrawingBox(SHAPE_TYPE.DECISION, 10, 15, 15, 45);

    // 會撐開到 24
    expect(result).toEqual({ x: 10, y: 15, endX: 34, endY: 45, width: 24, height: 30 });
  });

  it('一般圖形：滑鼠 Y 位置距離固定點 Y 不滿 24', () => {
    const result = getDrawingBox(SHAPE_TYPE.DECISION, 10, 15, 50, 35);

    // 會撐開到 24
    expect(result).toEqual({ x: 10, y: 15, endX: 50, endY: 39, width: 40, height: 24 });
  });

  it('一般圖形：往左上，不滿 24', () => {
    const result = getDrawingBox(SHAPE_TYPE.DECISION, 100, 100, 90, 95);

    // 會撐開到 24
    expect(result).toEqual({ x: 76, y: 76, endX: 76, endY: 76, width: 24, height: 24 });
  });

  it('一般圖形：差值 0', () => {
    const result = getDrawingBox(SHAPE_TYPE.DECISION, 100, 100, 100, 150);

    // 差值 0 往右撐到 24
    expect(result).toEqual({ x: 100, y: 100, endX: 124, endY: 150, width: 24, height: 50 });
  });

  it('一般圖形：滑鼠 X/Y 位置距離固定點 X/Y 皆不滿 24', () => {
    const result = getDrawingBox(SHAPE_TYPE.DECISION, 10, 15, 25, 35);

    // 會撐開到 24
    expect(result).toEqual({ x: 10, y: 15, endX: 34, endY: 39, width: 24, height: 24 });
  });

  it('線：滑鼠位置往右下', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 10, 15, 50, 65);

    expect(result).toEqual({ x: 10, y: 15, endX: 50, endY: 65, width: 40, height: 50 });
  });

  it('線：長度不滿 24，往右下撐到 24，方向不變', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 100, 100, 103, 104);

    // 長度 5，倍數 24 / 5 = 4.8：3 × 4.8 = 14.4、4 × 4.8 = 19.2
    expect(result.x).toBe(100);
    expect(result.y).toBe(100);
    expect(result.endX).toBeCloseTo(114.4);
    expect(result.endY).toBeCloseTo(119.2);
    expect(result.width).toBeCloseTo(14.4);
    expect(result.height).toBeCloseTo(19.2);
  });

  it('線：長度 0', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 100, 100, 100, 100);

    // 會向右，寬撐開到 24
    expect(result).toEqual({ x: 100, y: 100, endX: 124, endY: 100, width: 24, height: 0 });
  });

  it('線：往左上，長度不滿 24', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 100, 100, 97, 96);

    // 長度 5，倍數 24 / 5 = 4.8：3 × 4.8 = 14.4、4 × 4.8 = 19.2
    expect(result.x).toBeCloseTo(85.6);
    expect(result.y).toBeCloseTo(80.8);
    expect(result.endX).toBeCloseTo(85.6);
    expect(result.endY).toBeCloseTo(80.8);
    expect(result.width).toBeCloseTo(14.4);
    expect(result.height).toBeCloseTo(19.2);
  });

  it('滑鼠超出畫布右下', () => {
    const result = getDrawingBox(SHAPE_TYPE.INPUTOUTPUT, 100, 100, 700, 900);

    expect(result).toEqual({ x: 100, y: 100, endX: 600, endY: 800, width: 500, height: 700 });
  });

  it('滑鼠超出畫布左上', () => {
    const result = getDrawingBox(SHAPE_TYPE.TERMINAL, 100, 100, -50, -20);

    expect(result).toEqual({ x: 0, y: 0, endX: 0, endY: 0, width: 100, height: 100 });
  });

  it('靠右邊界，撐到 24 會出界 → 往左', () => {
    const result = getDrawingBox(SHAPE_TYPE.TERMINAL, 590, 100, 595, 150);

    expect(result).toEqual({ x: 566, y: 100, endX: 566, endY: 150, width: 24, height: 50 });
  });

  it('靠下邊界，撐到 24 會出界 → 往上', () => {
    const result = getDrawingBox(SHAPE_TYPE.TERMINAL, 100, 790, 150, 795);

    expect(result).toEqual({ x: 100, y: 766, endX: 150, endY: 766, width: 50, height: 24 });
  });

  it('靠左邊界，往左撐會出界 → 往右', () => {
    const result = getDrawingBox(SHAPE_TYPE.TERMINAL, 10, 100, 5, 150);

    expect(result).toEqual({ x: 10, y: 100, endX: 34, endY: 150, width: 24, height: 50 });
  });

  it('靠右邊界，差值 0 → 往左', () => {
    const result = getDrawingBox(SHAPE_TYPE.TERMINAL, 590, 100, 590, 150);

    expect(result).toEqual({ x: 566, y: 100, endX: 566, endY: 150, width: 24, height: 50 });
  });

  it('線：靠右邊界，水平撐到 24 會出界 → 反方向', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 590, 100, 595, 100);

    expect(result).toEqual({ x: 566, y: 100, endX: 566, endY: 100, width: 24, height: 0 });
  });

  it('線：靠右邊界，長度 0 → 往左', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 590, 100, 590, 100);

    expect(result).toEqual({ x: 566, y: 100, endX: 566, endY: 100, width: 24, height: 0 });
  });

  it('線：滑鼠超出右邊', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 100, 100, 700, 100);

    expect(result).toEqual({ x: 100, y: 100, endX: 600, endY: 100, width: 500, height: 0 });
  });

  it('線：往右下撐到長度 24 會出界 → 往左下', () => {
    const result = getDrawingBox(SHAPE_TYPE.FLOWLINE, 590, 100, 598, 106);

    // 長度 5，倍數 24 / 5 = 4.8：4 × 4.8 = 19.2、3 × 4.8 = 14.4
    expect(result.x).toBeCloseTo(570.8);
    expect(result.y).toBe(100);
    expect(result.endX).toBeCloseTo(570.8);
    expect(result.endY).toBeCloseTo(114.4);
    expect(result.width).toBeCloseTo(19.2);
    expect(result.height).toBeCloseTo(14.4);
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
  it('控制點 nw，更換 endX/Y，x/y, width/height 重算', () => {
    const handle = 'nw-resize';
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
    });
    const result = getResizingBox(handle, shape, 150, 150);

    expect(result).toEqual({ x: 150, y: 150, startX: 300, startY: 300, endX: 150, endY: 150, width: 150, height: 150 });
  });

  it('控制點 n，endX 不變，y, height 重算', () => {
    const handle = 'n-resize';
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
    });
    const result = getResizingBox(handle, shape, 10, 50);

    expect(result).toEqual({ x: 50, y: 50, startX: 50, startY: 350, endX: 350, endY: 50, width: 300, height: 300 });
  });

  it('控制點 ne，更換 endX/Y，x/y, width/height 重算', () => {
    const handle = 'ne-resize';
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
    });
    const result = getResizingBox(handle, shape, 50, 50);

    expect(result).toEqual({ x: 50, y: 50, startX: 150, startY: 380, endX: 50, endY: 50, width: 100, height: 330 });
  });

  it('控制點 w，endY 不變，x, width 重算', () => {
    const handle = 'w-resize';
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
    });
    const result = getResizingBox(handle, shape, 120, 100);

    expect(result).toEqual({ x: 120, y: 50, startX: 320, startY: 50, endX: 120, endY: 120, width: 200, height: 70 });
  });

  it('控制點 e，endY 不變，x, width 重算', () => {
    const handle = 'e-resize';
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
    });
    const result = getResizingBox(handle, shape, 70, 50);

    expect(result).toEqual({ x: 70, y: 100, startX: 120, startY: 100, endX: 70, endY: 350, width: 50, height: 250 });
  });

  it('控制點 sw，更換 end，x/y, width/height 重算', () => {
    const handle = 'sw-resize';
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
    });
    const result = getResizingBox(handle, shape, 100, 400);

    expect(result).toEqual({ x: 100, y: 180, startX: 300, startY: 180, endX: 100, endY: 400, width: 200, height: 220 });
  });

  it('控制點 s，endX 不變，y, height 重算', () => {
    const handle = 's-resize';
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
    });
    const result = getResizingBox(handle, shape, 500, 800);

    expect(result).toEqual({ x: 150, y: 300, startX: 150, startY: 300, endX: 450, endY: 800, width: 300, height: 500 });
  });

  it('控制點 se，更換 endX/Y，x/y, width/height 重算', () => {
    const handle = 'se-resize';
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
    });
    const result = getResizingBox(handle, shape, 350, 350);

    expect(result).toEqual({ x: 50, y: 100, startX: 50, startY: 100, endX: 350, endY: 350, width: 300, height: 250 });
  });

  it('控制點 start，更換 startX/Y', () => {
    const handle = 'start-resize';
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
    });
    const result = getResizingBox(handle, shape, 250, 100);

    expect(result).toEqual({ x: 200, y: 100, startX: 250, startY: 100, endX: 200, endY: 300, width: 50, height: 200 });
  });

  it('控制點 end，更換 endX/Y', () => {
    const handle = 'end-resize';
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
    });
    const result = getResizingBox(handle, shape, 150, 100);

    expect(result).toEqual({ x: 150, y: 100, startX: 300, startY: 400, endX: 150, endY: 100, width: 150, height: 300 });
  });

  it('控制點 n: 滑鼠 Y 位置離固定點 Y 不滿 24，x 不變，y, height 重算', () => {
    const handle = 'n-resize';
    const shape = generateShape({
      x: 100,
      y: 100,
      startX: 100,
      startY: 300,
      endX: 300,
      endY: 100,
      width: 200,
      height: 200,
      type: SHAPE_TYPE.TERMINAL,
    });
    const result = getResizingBox(handle, shape, 105, 290);

    expect(result).toEqual({ x: 100, y: 276, startX: 100, startY: 300, endX: 300, endY: 276, width: 200, height: 24 });
  });

  it('Y 方向拖過固定點', () => {
    const handle = 'se-resize';
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
    });
    const result = getResizingBox(handle, shape, 200, 50);

    expect(result).toEqual({ x: 100, y: 50, startX: 100, startY: 100, endX: 200, endY: 50, width: 100, height: 50 });
  });

  it('線：靠下邊界，撐到 24 會出界 → 往上', () => {
    const handle = 'start-resize';
    const shape = generateShape({
      x: 100,
      y: 740,
      startX: 100,
      startY: 740,
      endX: 100,
      endY: 790,
      width: 0,
      height: 50,
      type: SHAPE_TYPE.FLOWLINE,
    });
    const result = getResizingBox(handle, shape, 100, 800);

    expect(result).toEqual({ x: 100, y: 766, startX: 100, startY: 766, endX: 100, endY: 790, width: 0, height: 24 });
  });

  it('線：控制點 end，拖移到長度不滿 24，往滑鼠方向 (下) 撐到 24', () => {
    const handle = 'end-resize';
    const shape = generateShape({
      x: 100,
      y: 100,
      startX: 100,
      startY: 100,
      endX: 300,
      endY: 300,
      width: 200,
      height: 200,
      type: SHAPE_TYPE.FLOWLINE,
    });
    const result = getResizingBox(handle, shape, 100, 112);

    expect(result).toEqual({ x: 100, y: 100, startX: 100, startY: 100, endX: 100, endY: 124, width: 0, height: 24 });
  });

  it('線：控制點 start，拖到和固定點相同位置', () => {
    const handle = 'start-resize';
    const shape = generateShape({
      x: 100,
      y: 100,
      startX: 100,
      startY: 100,
      endX: 300,
      endY: 300,
      width: 200,
      height: 200,
      type: SHAPE_TYPE.FLOWLINE,
    });
    const result = getResizingBox(handle, shape, 300, 300);

    expect(result).toEqual({ x: 300, y: 300, startX: 324, startY: 300, endX: 300, endY: 300, width: 24, height: 0 });
  });

  it('線：控制點 start，拖到固定點，長度 0 而且靠右邊界，往左撐', () => {
    const handle = 'start-resize';
    const shape = generateShape({
      x: 400,
      y: 100,
      startX: 400,
      startY: 100,
      endX: 590,
      endY: 100,
      width: 190,
      height: 0,
      type: SHAPE_TYPE.FLOWLINE,
    });
    const result = getResizingBox(handle, shape, 590, 100);

    expect(result).toEqual({ x: 566, y: 100, startX: 566, startY: 100, endX: 590, endY: 100, width: 24, height: 0 });
  });

  it('線：控制點 end，滑鼠超出畫布', () => {
    const handle = 'end-resize';
    const shape = generateShape({
      x: 100,
      y: 100,
      startX: 100,
      startY: 100,
      endX: 500,
      endY: 200,
      width: 400,
      height: 100,
      type: SHAPE_TYPE.FLOWLINE,
    });
    const result = getResizingBox(handle, shape, 700, -50);

    expect(result).toEqual({ x: 100, y: 0, startX: 100, startY: 100, endX: 600, endY: 0, width: 500, height: 100 });
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

describe('findChangedShape: 找出新增或位置、大小改變的圖形', () => {
  it('有新增的圖形時，回傳新增的圖形', () => {
    const prev = { id: 'test-1' };
    const next = { id: 'test-2' };
    const oldShapes = [prev];
    const newShapes = [prev, next];
    const result = findChangedShape(oldShapes, newShapes);

    expect(result).toBe(next);
  });

  it('目前圖形和 prev 的座標位置不同', () => {
    const oldShapes = [{ id: 'test-1', startX: 100, startY: 150, endX: 200, endY: 250 }];
    const newShapes = [{ id: 'test-1', startX: 100, startY: 150, endX: 300, endY: 400 }];
    const result = findChangedShape(oldShapes, newShapes);

    expect(result).toBe(newShapes[0]);
  });

  it('只少了圖形時，回傳 undefined', () => {
    const oldShapes = [{ id: 'test-1' }, { id: 'test-2' }];
    const newShapes = [{ id: 'test-1' }];
    const result = findChangedShape(oldShapes, newShapes);

    expect(result).toBe(undefined);
  });
});
