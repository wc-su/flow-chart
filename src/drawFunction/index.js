/**
 * 一個圖形的資料（存在 Redux 的 data 陣列、也存進 Firestore）
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
// flowline 的兩個端點，位置直接用線的 start、end，只用到 cursor
const lineHandleConfig = [{ cursor: 'start-resize' }, { cursor: 'end-resize' }];

/**
 * 建立一個剛開始畫的新圖形：起點和終點都在滑鼠位置，寬高是 0，之後由 draw 更新終點。
 * @param {Object} payload 由 startDraw 的 prepare 產生
 * @param {string} payload.id uuid，存成圖形的 id
 * @param {number} payload.x 滑鼠在畫布上的 x
 * @param {number} payload.y 滑鼠在畫布上的 y
 * @param {string} payload.drawType 圖形種類（terminal、process、inputOutput、decision、flowline）
 * @returns {Shape} 新圖形的資料
 */
function createShape({ id, x, y, drawType }) {
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
  };
}

/**
 * 產生選取中圖形的選取框和控制點，疊在原本的圖形上顯示。不會修改傳入的 data。
 * @param {Shape[]} data 全部圖形
 * @param {string|null} selectedId 被選取圖形的 id（uuid），沒選取時是 null
 * @param {string} activeHandle 正在拖曳的控制點 cursor（例如 'se-resize'），沒有時是 ''
 * @returns {Array} 一般圖形：[選取框, 8 個控制點]；flowline：[起點, 終點]；沒選取：[]
 */
function buildSelectionOverlay(data, selectedId, activeHandle) {
  const selected = data.find((item) => item.id === selectedId);
  if (selected) {
    // 深拷貝被選取的圖形：data 來自 Redux state，已被 Immer 凍結，直接修改會報錯
    const box = JSON.parse(JSON.stringify(selected));
    // 整理座標：由右下往左上畫時 start 會比 end 大，統一成 start 在左上、end 在右下，後面才能從左上角算控制點位置。
    // flowline 有方向（箭頭），不能整理
    if (box.type !== 'flowline') {
      const newStartX = Math.min(box.startX, box.endX);
      const newStartY = Math.min(box.startY, box.endY);
      const newEndX = Math.max(box.startX, box.endX);
      const newEndY = Math.max(box.startY, box.endY);
      box.startX = newStartX;
      box.startY = newStartY;
      box.x = newStartX;
      box.y = newStartY;
      box.endX = newEndX;
      box.endY = newEndY;
    }

    // 控制點的樣板：必須在下面改成選取框之前複製，否則會繼承 pointerEvents: 'none'，控制點會點不到
    const handleBase = JSON.parse(JSON.stringify(box));

    // 非「線」，改成長方形選取框、藍色虛線，pointerEvents: 'none' 讓滑鼠穿過選取框，點到下面的圖形。
    if (box.type !== 'flowline') {
      box.type = 'process';
      box.decorate.stroke = '#00a8ff';
      box.decorate.strokeDasharray = '3';
      box.pointerEvents = 'none';
    }

    const overlay = [];
    // 一般圖形才有選取框；縮放中時隱藏
    if (box.type !== 'flowline') {
      if (activeHandle !== '') {
        box.display = 'none';
      }
      overlay.push(box);
    }

    // 先記下圖形寬高（下面會被改成控制點的大小），再把樣板改成藍色實心圓，半徑 4（Ellipse 以 x, y 為圓心）
    const boxWidth = handleBase.width;
    const boxHeight = handleBase.height;
    handleBase.decorate.fill = '#00a8ff';
    handleBase.decorate.stroke = 'none';
    handleBase.type = 'ellipse';
    handleBase.width = 4;
    handleBase.height = 4;

    if (box.type === 'flowline') {
      // 兩個端點直接用線的 start、end
      overlay.push({ ...handleBase });
      overlay[0].id = `${box.id}:${lineHandleConfig[0].cursor}`;
      overlay[0].cursor = lineHandleConfig[0].cursor;
      overlay[0].x = overlay[0].startX;
      overlay[0].y = overlay[0].startY;
      overlay[0].endX = overlay[0].startX;
      overlay[0].endY = overlay[0].startY;
      // 縮放中只顯示正在拖的那個控制點
      if (activeHandle && activeHandle !== lineHandleConfig[0].cursor) {
        overlay[0].display = 'none';
      }
      overlay.push({ ...handleBase });
      overlay[1].id = `${box.id}:${lineHandleConfig[1].cursor}`;
      overlay[1].cursor = lineHandleConfig[1].cursor;
      overlay[1].startX = overlay[1].endX;
      overlay[1].startY = overlay[1].endY;
      overlay[1].x = overlay[1].endX;
      overlay[1].y = overlay[1].endY;
      // 縮放中只顯示正在拖的那個控制點
      if (activeHandle && activeHandle !== lineHandleConfig[1].cursor) {
        overlay[1].display = 'none';
      }
    } else {
      // 依 config 算出每個控制點的位置
      for (let i = 1; i <= handleConfig.length; i++) {
        overlay.push({ ...handleBase });
        overlay[i].id = `${box.id}:${handleConfig[i - 1].cursor}`;
        overlay[i].cursor = handleConfig[i - 1].cursor;
        // 位置 = 左上角 + 寬高 × 比例（0 左／上、0.5 中間、1 右／下）
        overlay[i].startX += boxWidth * handleConfig[i - 1].x;
        overlay[i].startY += boxHeight * handleConfig[i - 1].y;
        overlay[i].x = overlay[i].startX;
        overlay[i].y = overlay[i].startY;
        overlay[i].endX = overlay[i].startX;
        overlay[i].endY = overlay[i].startY;
        // 縮放中只顯示正在拖的那個控制點
        if (activeHandle) {
          overlay[i].display = handleConfig[i - 1].cursor === activeHandle ? 'block' : 'none';
        }
      }
    }
    return overlay;
  } else {
    return [];
  }
}

export { createShape, buildSelectionOverlay };
