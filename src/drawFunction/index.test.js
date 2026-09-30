import { describe, expect, it } from 'vitest';
import { createShape, buildSelectionOverlay } from './index';

const testData = [
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
  },
];

describe('createShape: 繪製新圖形的第一步', () => {
  it('畫圖 terminal', () => {
    const input = { id: 'test-uuid', x: 0, y: 1, drawType: 'terminal' };
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
    const output = buildSelectionOverlay(testData, null, '');

    expect(output).toEqual([]);
  });

  it('找不到圖形：回傳空陣列', () => {
    const output = buildSelectionOverlay(testData, 'test-uuid-unknown', '');

    expect(output).toEqual([]);
  });

  it('一般圖形：回傳選取框 + 8 個控制點', () => {
    const output = buildSelectionOverlay(testData, 'test-uuid-terminal', '');

    expect(output).toHaveLength(9);
    // 取得選取框
    const selectionBox = output[0];
    expect(selectionBox.type).toBe('process');
    expect(selectionBox.decorate).toMatchObject({ stroke: '#00a8ff', strokeDasharray: '3' });
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
    const output = buildSelectionOverlay(testData, 'test-uuid-terminal-resizing', 'nw-resize');

    expect(output).toHaveLength(9);

    // 只有 nw-resize 的控制點為顯示，選取框以及其他控制點不顯示
    const visible = output.filter((item) => item.display === 'block');
    expect(visible).toHaveLength(1);
    expect(visible[0]).toMatchObject({ cursor: 'nw-resize', x: 10, y: 20 });
  });

  it('不會改到傳進去的 data', () => {
    // structuredClone 是瀏覽器和 Node 內建的深拷貝函式
    const before = structuredClone(testData);

    buildSelectionOverlay(testData, 'test-uuid-terminal-resizing', 'nw-resize');

    // 不會改到傳進去的 data
    expect(testData).toEqual(before);
  });

  it('flowline: 回傳起點、終點', () => {
    const output = buildSelectionOverlay(testData, 'test-uuid-flowline', '');

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
    const output = buildSelectionOverlay(testData, 'test-uuid-flowline-reverse', '');

    expect(output).toHaveLength(2);
    // 取得控制點，確認 id, cursor, x, y
    const handles = output.map(({ id, cursor, x, y }) => ({ id, cursor, x, y }));
    expect(handles).toEqual([
      { id: 'test-uuid-flowline-reverse:start-resize', cursor: 'start-resize', x: 150, y: 100 },
      { id: 'test-uuid-flowline-reverse:end-resize', cursor: 'end-resize', x: 50, y: 60 },
    ]);
  });

  it('flowline 拖曳起點：只顯示起點', () => {
    const output = buildSelectionOverlay(testData, 'test-uuid-flowline', 'start-resize');

    expect(output).toHaveLength(2);
    // 只有 start-resize 的控制點為顯示，另一個控制點不顯示
    const visible = output.filter((item) => item.display === 'block').map((item) => item.cursor);
    expect(visible).toEqual(['start-resize']);
  });
});
