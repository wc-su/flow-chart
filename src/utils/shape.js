/**
 * 一個圖形的資料（存在 Redux 的 shapes 陣列、也存進 Firestore）
 * @typedef {Object} Shape
 * @property {string} id 圖形 id（uuid）
 * @property {string} type terminal、process、inputOutput、decision、flowline
 * @property {number} startX 畫圖中：按下滑鼠的位置；縮放中：固定不動的對角。
 *   放開滑鼠後，flowline 以外會整理成左上角；flowline 保留畫的方向（箭頭）
 * @property {number} startY 同 startX
 * @property {number} endX 畫圖中、縮放中：滑鼠目前的位置。放開後，flowline 以外會整理成右下角
 * @property {number} endY 同 endX
 * @property {number} x 左上角（start、end 中比較小的），給 <rect> 等元件畫圖用
 * @property {number} y 同 x
 * @property {number} width 寬，一律是正數
 * @property {number} height 高，一律是正數
 */

// 8 個縮放控制點，x、y 是在圖形上的位置比例（0～1）
const handleConfig = [
  { cursor: 'nw-resize', x: 0, y: 0 },
  { cursor: 'n-resize', x: 0.5, y: 0 },
  { cursor: 'ne-resize', x: 1, y: 0 },
  { cursor: 'w-resize', x: 0, y: 0.5 },
  { cursor: 'e-resize', x: 1, y: 0.5 },
  { cursor: 'sw-resize', x: 0, y: 1 },
  { cursor: 's-resize', x: 0.5, y: 1 },
  { cursor: 'se-resize', x: 1, y: 1 },
];
// flowline 的兩個端點：比例 0 是起點、1 是終點
const lineHandleConfig = [
  { cursor: 'start-resize', x: 0, y: 0 },
  { cursor: 'end-resize', x: 1, y: 1 },
];

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 800;
const MIN_SHAPE_SIZE = 24;

export const SHAPE_TYPE = Object.freeze({
  TERMINAL: 'terminal',
  PROCESS: 'process',
  INPUTOUTPUT: 'inputOutput',
  DECISION: 'decision',
  FLOWLINE: 'flowline',
});

/**
 * 建立一個剛開始畫的新圖形：起點和終點都在滑鼠位置，寬高是 0，之後由 draw 更新終點。
 * @param {Object} payload 由 startDraw 的 prepare 產生
 * @param {string} payload.id uuid，存成圖形的 id
 * @param {number} payload.x 滑鼠在畫布上的 x
 * @param {number} payload.y 滑鼠在畫布上的 y
 * @param {string} payload.drawType 圖形種類（terminal、process、inputOutput、decision、flowline）
 * @returns {Shape} 新圖形的資料
 */
export function createShape({ id, x, y, drawType }) {
  return {
    id: id,
    startX: x,
    startY: y,
    endX: x,
    endY: y,
    x: x,
    y: y,
    width: 0,
    height: 0,
    type: drawType,
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
}

/**
 * 產生選取中圖形的選取框和控制點，疊在原本的圖形上顯示。不會修改傳入的 shapes。
 * @param {Shape[]} shapes 全部圖形
 * @param {string|null} selectedId 被選取圖形的 id（uuid），沒選取時是 null
 * @param {string} activeHandle 正在拖曳的控制點 cursor（例如 'se-resize'），沒有時是 ''
 * @returns {Array} 一般圖形：[選取框, 8 個控制點]；flowline：[起點, 終點]；沒選取：[]
 */
export function buildSelectionOverlay(shapes, selectedId, activeHandle) {
  const selected = shapes.find((item) => item.id === selectedId);
  if (selected) {
    // 深拷貝被選取的圖形：shapes 來自 Redux state，已被 Immer 凍結，直接修改會報錯
    const box = JSON.parse(JSON.stringify(selected));
    // 整理座標：由右下往左上畫時 start 會比 end 大，統一成 start 在左上、end 在右下，後面才能從左上角算控制點位置。
    // flowline 有方向（箭頭），不能整理
    if (box.type !== SHAPE_TYPE.FLOWLINE) {
      Object.assign(box, normalizeBox(box));
      box.x = box.startX;
      box.y = box.startY;
    }

    // 增加 relationId，對應被點選的圖形 id
    box.relationId = box.id;

    // 控制點的樣板：必須在下面改成選取框之前複製，否則會繼承 pointerEvents: 'none'，控制點會點不到
    const handleBase = JSON.parse(JSON.stringify(box));

    // 非「線」，改成長方形選取框、藍色虛線，pointerEvents: 'none' 讓滑鼠穿過選取框，點到下面的圖形。
    if (box.type !== SHAPE_TYPE.FLOWLINE) {
      box.type = 'process';
      box.style.stroke = '#00a8ff';
      box.style.strokeDasharray = '3';
      box.pointerEvents = 'none';
    }

    const overlay = [];
    // 一般圖形才有選取框；縮放中時隱藏
    if (box.type !== SHAPE_TYPE.FLOWLINE) {
      if (activeHandle !== '') {
        box.display = 'none';
      }
      overlay.push(box);
    }

    // 把樣板改成藍色實心圓，半徑 4（Ellipse 以 x, y 為圓心）
    handleBase.style.fill = '#00a8ff';
    handleBase.style.stroke = 'none';
    handleBase.type = 'ellipse';
    handleBase.width = 4;
    handleBase.height = 4;

    const config = box.type === SHAPE_TYPE.FLOWLINE ? lineHandleConfig : handleConfig;
    for (const handleItem of config) {
      const handle = { ...handleBase };
      handle.id = `${box.id}:${handleItem.cursor}`;
      handle.cursor = handleItem.cursor;
      // 位置 = start + (end − start) × 比例：比例 0 是起點、1 是終點，
      // 一般圖形的 start、end 已整理成左上、右下，flowline 保留畫的方向，兩種都適用
      handle.startX += (handle.endX - handle.startX) * handleItem.x;
      handle.startY += (handle.endY - handle.startY) * handleItem.y;
      handle.endX = handle.startX;
      handle.endY = handle.startY;
      handle.x = handle.startX;
      handle.y = handle.startY;
      // 縮放中只顯示正在拖的那個控制點
      if (activeHandle) {
        handle.display = handleItem.cursor === activeHandle ? 'block' : 'none';
      }
      overlay.push(handle);
    }

    return overlay;
  } else {
    return [];
  }
}

/**
 * 整理座標，把 start、end 整理成 start 在左上、end 在右下
 * @param {Object} params
 * @param {number} params.startX 起點 X
 * @param {number} params.startY 起點 Y
 * @param {number} params.endX 終點 X
 * @param {number} params.endY 終點 Y
 * @returns {Object} 整理後的 startX、startY、endX、endY
 */
export function normalizeBox({ startX, startY, endX, endY }) {
  return {
    startX: Math.min(startX, endX),
    startY: Math.min(startY, endY),
    endX: Math.max(startX, endX),
    endY: Math.max(startY, endY),
  };
}

/**
 * 滑鼠座標轉換成在畫布上的座標
 * @param {Object} params
 * @param {number} params.clientX 滑鼠 X 座標
 * @param {number} params.clientY 滑鼠 Y 座標
 * @param {DOMRect} params.rect 畫布的 getBoundingClientRect()
 * @param {number} params.rate 畫布比例
 * @returns {Object} 畫布上的座標 x, y
 */
export function toCanvasPoint({ clientX, clientY, rect, rate }) {
  const x = (clientX - rect.left) / rate;
  const y = (clientY - rect.top) / rate;
  return { x, y };
}

/**
 * 依圖形、滑鼠位置計算 x, y 和寬高
 * @param {string} shapeType 圖形類型
 * @param {number} anchorX 圖形固定點 X
 * @param {number} anchorY 圖形固定點 Y
 * @param {number} pointerX 滑鼠在畫布位置 X
 * @param {number} pointerY 滑鼠在畫布位置 Y
 * @returns {Object} 計算的終點、x, y 和寬高
 */
export function getDrawingBox(shapeType, anchorX, anchorY, pointerX, pointerY) {
  const { x: newEndX, y: newEndY } = clampMinSize({ type: shapeType, anchorX, anchorY, pointerX, pointerY });
  return {
    endX: newEndX,
    endY: newEndY,
    x: Math.min(anchorX, newEndX),
    y: Math.min(anchorY, newEndY),
    width: Math.abs(newEndX - anchorX),
    height: Math.abs(newEndY - anchorY),
  };
}

/**
 * 是不是太小、不該保留的圖形
 * @param {string} type 圖形種類
 * @param {number} width 寬度
 * @param {number} height 高度
 * @returns {boolean} true 表示太小 (一般圖形寬或高小於 24，flowline 長度小於 24)
 */
export function isEmptyShape(type, width, height) {
  if (type === SHAPE_TYPE.FLOWLINE) {
    return Math.hypot(width, height) < MIN_SHAPE_SIZE;
  } else {
    return width < MIN_SHAPE_SIZE || height < MIN_SHAPE_SIZE;
  }
}

/**
 * 依傳入的距離差更新初始狀態
 * @param {Object} params
 * @param {Object} params.initShape 點下的初始狀態
 * @param {number} params.distanceX x 的距離差
 * @param {number} params.distanceY y 的距離差
 * @returns {Object} 更新後的座標 { x, y, startX, startY, endX, endY }
 */
export function getMovedShape({ initShape, distanceX, distanceY }) {
  const { x, y, startX, startY, endX, endY, width, height } = initShape;
  const actualX = Math.min(Math.max(x + distanceX, 0), CANVAS_WIDTH - width);
  const actualY = Math.min(Math.max(y + distanceY, 0), CANVAS_HEIGHT - height);
  const actualDistanceX = actualX - x;
  const actualDistanceY = actualY - y;
  return {
    x: actualX,
    y: actualY,
    startX: startX + actualDistanceX,
    startY: startY + actualDistanceY,
    endX: endX + actualDistanceX,
    endY: endY + actualDistanceY,
  };
}

/**
 * 比對新舊座標，看圖形是否相同
 * @param {Object} oldShape 舊的圖形
 * @param {Object} newShape 新的圖形
 * @returns {boolean} true 表示相同
 */
export function isSameShape(oldShape, newShape) {
  return oldShape.x === newShape.x && oldShape.y === newShape.y;
}

/**
 * 依控制點、圖形、滑鼠位置計算 x, y 和寬高
 * @param {string} activeHandle 控制點
 * @param {Object} shape 圖形
 * @param {number} pointerX 滑鼠在畫布位置 X
 * @param {number} pointerY 滑鼠在畫布位置 Y
 * @returns {Object} 計算的起點、終點、x, y 和寬高
 */
export function getResizingBox(activeHandle, shape, pointerX, pointerY) {
  const result = {
    startX: shape.startX,
    startY: shape.startY,
    endX: shape.endX,
    endY: shape.endY,
    x: Math.min(shape.startX, shape.endX),
    y: Math.min(shape.startY, shape.endY),
    width: Math.abs(shape.endX - shape.startX),
    height: Math.abs(shape.endY - shape.startY),
  };

  const isStartResize = activeHandle === 'start-resize';

  const { x: clampX, y: clampY } = clampMinSize({
    type: shape.type,
    anchorX: isStartResize ? result.endX : result.startX,
    anchorY: isStartResize ? result.endY : result.startY,
    pointerX,
    pointerY,
  });

  // n、s 控制點僅可動垂直方向 (Y)，不可異動 X，將其排除
  const changeX = !['n-resize', 's-resize'].includes(activeHandle);
  // w、e 控制點只能動水平方向 (X)，不可異動 Y，將其排除
  const changeY = !['w-resize', 'e-resize'].includes(activeHandle);

  if (isStartResize) {
    result.startX = clampX;
    result.startY = clampY;
  } else {
    if (changeX) result.endX = clampX;
    if (changeY) result.endY = clampY;
  }
  if (changeX) {
    result.x = Math.min(result.startX, result.endX);
    result.width = Math.abs(result.endX - result.startX);
  }
  if (changeY) {
    result.y = Math.min(result.startY, result.endY);
    result.height = Math.abs(result.endY - result.startY);
  }

  return result;
}

/**
 * 比對新舊圖形起點、終點座標，看圖形是否相同
 * @param {Object} oldShape 舊的圖形
 * @param {Object} newShape 新的圖形
 * @returns {boolean} true 表示相同
 */
export function isEqualShape(oldShape, newShape) {
  return (
    oldShape.startX === newShape.startX &&
    oldShape.startY === newShape.startY &&
    oldShape.endX === newShape.endX &&
    oldShape.endY === newShape.endY
  );
}

/**
 * 一般圖形依固定點、滑鼠位置，計算位置並限制最小值
 * @param {number} anchor 固定點
 * @param {number} pointer 滑鼠位置
 * @returns {number} 計算後的位置
 */
function clampAxis(anchor, pointer) {
  let result = pointer;
  const diff = pointer - anchor;
  if (Math.abs(diff) < MIN_SHAPE_SIZE) {
    result = anchor + MIN_SHAPE_SIZE * (Math.sign(diff) >= 0 ? 1 : -1);
  }
  return result;
}
/**
 * 線依固定點、滑鼠位置，計算位置並限制最小值
 * @param {number} anchorX 固定點 X
 * @param {number} anchorY 固定點 Y
 * @param {number} pointerX 滑鼠位置 X
 * @param {number} pointerY 滑鼠位置 Y
 * @returns {Object} 計算後的位置 x, y
 */
function clampLineLength(anchorX, anchorY, pointerX, pointerY) {
  const dx = pointerX - anchorX;
  const dy = pointerY - anchorY;
  const length = Math.hypot(dx, dy);
  if (length < MIN_SHAPE_SIZE) {
    if (length === 0) {
      return { x: anchorX + MIN_SHAPE_SIZE, y: anchorY };
    } else {
      const scale = MIN_SHAPE_SIZE / length;
      return { x: anchorX + dx * scale, y: anchorY + dy * scale };
    }
  } else {
    return { x: pointerX, y: pointerY };
  }
}
/**
 * 依圖形類別、固定點、滑鼠位置計算 x, y
 * @param {Object} param
 * @param {string} param.type 圖形類別
 * @param {number} param.anchorX 固定點 X
 * @param {number} param.anchorY 固定點 Y
 * @param {number} param.pointerX 滑鼠位置 X
 * @param {number} param.pointerY 滑鼠位置 Y
 * @returns {Object} 計算後的位置 x, y
 */
function clampMinSize({ type, anchorX, anchorY, pointerX, pointerY }) {
  if (type === SHAPE_TYPE.FLOWLINE) {
    return clampLineLength(anchorX, anchorY, pointerX, pointerY);
  } else {
    return { x: clampAxis(anchorX, pointerX), y: clampAxis(anchorY, pointerY) };
  }
}
