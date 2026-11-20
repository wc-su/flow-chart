import { useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import clsx from 'clsx';

import { chartActions, selectShapes, selectSelectionOverlay } from '@/redux/chartSlice';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  toCanvasPoint,
  isSameShape,
  isEqualShape,
  normalizeBox,
  SHAPE_TYPE,
} from '@/utils/shape';
import { TOOL } from '@/pages/Chart/components/Tool/tool';
import { useTool } from '@/pages/Chart/components/Tool/ToolContext';

import CanvasDrawItem from './CanvasDrawItem';

import './Canvas.scss';

const DRAW_STATUS = Object.freeze({
  IDLE: 'idle',
  DRAWING: 'drawing',
  RESIZING: 'resizing',
  PANNING: 'panning',
  DRAGGING: 'dragging',
});

// 移動超過這個距離 (螢幕 px) 才算拖曳
const DRAG_THRESHOLD = 4;

const Canvas = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const drawStatus = useRef(DRAW_STATUS.IDLE);
  // 按下時的資料：畫圖存滑鼠位置、拖曳存圖形和滑鼠位置、縮放存圖形
  const pointerDownData = useRef({});
  const hasMoved = useRef(false);

  const { tool, setTool } = useTool();

  const shapes = useSelector(selectShapes);
  const selectionOverlay = useSelector(selectSelectionOverlay);

  const newRate = 1;
  const isMoveTool = tool === TOOL.MOVE;
  const isDrawTool = !!tool && tool !== TOOL.MOVE;

  function handlePointerDown(e) {
    if (e.button !== 0) return;

    // 沒選擇工具時點選空白處，取消選取 (點圖形的事件已在 handleShapePointerDown 擋下)
    if (!tool) {
      dispatch(chartActions.clearSelection());
      return;
    }
    // 選了繪圖工具時，開始畫新圖形
    if (isDrawTool) {
      drawStatus.current = DRAW_STATUS.DRAWING;
      hasMoved.current = false;
      pointerDownData.current = { clientX: e.clientX, clientY: e.clientY };
      const position = toCanvasPoint({
        clientX: e.clientX,
        clientY: e.clientY,
        rect: e.currentTarget.getBoundingClientRect(),
        rate: newRate,
      });
      dispatch(chartActions.startDraw(position.x, position.y, tool));
    }
  }

  function handlePointerMove(e) {
    if (drawStatus.current === DRAW_STATUS.DRAWING) {
      if (!hasMoved.current) {
        const distance = Math.hypot(
          e.clientX - pointerDownData.current.clientX,
          e.clientY - pointerDownData.current.clientY
        );
        if (distance <= DRAG_THRESHOLD) {
          return;
        } else {
          hasMoved.current = true;
        }
      }
      dispatch(
        chartActions.draw(
          toCanvasPoint({
            clientX: e.clientX,
            clientY: e.clientY,
            rect: e.currentTarget.getBoundingClientRect(),
            rate: newRate,
          })
        )
      );
    } else if (drawStatus.current === DRAW_STATUS.DRAGGING) {
      const distanceX = (e.clientX - pointerDownData.current.clientX) / newRate;
      const distanceY = (e.clientY - pointerDownData.current.clientY) / newRate;
      dispatch(
        chartActions.moveShape({
          initShape: pointerDownData.current.shape,
          distanceX,
          distanceY,
        })
      );
    } else if (drawStatus.current === DRAW_STATUS.RESIZING) {
      dispatch(
        chartActions.resizeShape(
          toCanvasPoint({
            clientX: e.clientX,
            clientY: e.clientY,
            rect: e.currentTarget.getBoundingClientRect(),
            rate: newRate,
          })
        )
      );
    }
  }

  function handlePointerUp() {
    if (drawStatus.current === DRAW_STATUS.DRAWING) {
      if (hasMoved.current) {
        const latest = selectShapes(store.getState());
        const { id } = latest[latest.length - 1];
        dispatch(chartActions.endDraw({ id }));
        setTool(null);
      } else {
        dispatch(chartActions.cancelDraw());
      }
      drawStatus.current = DRAW_STATUS.IDLE;
    } else if (drawStatus.current === DRAW_STATUS.DRAGGING) {
      const latest = selectShapes(store.getState());
      const { id } = pointerDownData.current.shape;
      if (
        !isSameShape(
          pointerDownData.current.shape,
          latest.find((shape) => shape.id === id)
        )
      ) {
        dispatch(chartActions.endDraw({ id }));
      }
      drawStatus.current = DRAW_STATUS.IDLE;
    } else if (drawStatus.current === DRAW_STATUS.RESIZING) {
      const latestShapes = selectShapes(store.getState());
      const initShape = pointerDownData.current.shape;
      const { id } = initShape;
      const latestShape = latestShapes.find((shape) => shape.id === id);
      const isFlowline = latestShape.type === SHAPE_TYPE.FLOWLINE;
      const isEqual = isEqualShape(initShape, isFlowline ? latestShape : normalizeBox(latestShape));
      if (isEqual) {
        dispatch(chartActions.normalizeShape({ id }));
      } else {
        dispatch(chartActions.endDraw({ id }));
      }

      drawStatus.current = DRAW_STATUS.IDLE;
    }
  }

  function handleShapePointerDown(e, shape) {
    if (e.button !== 0) return;

    // 擋下事件，不讓它冒泡到畫布的 handlePointerDown 又被取消選取
    e.stopPropagation();
    if (shape.type === 'ellipse') {
      const latest = selectShapes(store.getState());
      const { relationId, cursor } = shape;
      // 記住點選的圖形
      pointerDownData.current = { shape: latest.find((item) => item.id === relationId) };
      // 傳入 id 為要調整座標的圖形
      dispatch(chartActions.startResize({ id: relationId, activeHandle: cursor }));
      drawStatus.current = DRAW_STATUS.RESIZING;
    } else {
      // 記住點選圖形的資訊以及滑鼠的座標位置
      pointerDownData.current = {
        shape: shape,
        clientX: e.clientX,
        clientY: e.clientY,
      };
      dispatch(chartActions.setSelection({ selectedId: shape.id, activeHandle: '' }));
      drawStatus.current = DRAW_STATUS.DRAGGING;
    }
  }

  return (
    <div
      className={clsx('canvas', isMoveTool && 'canvas--moving', isDrawTool && 'canvas--drawing')}
      style={{
        top: 0,
        left: 0,
        width: CANVAS_WIDTH * newRate,
        height: CANVAS_HEIGHT * newRate,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        width={CANVAS_WIDTH * newRate}
        height={CANVAS_HEIGHT * newRate}
        viewBox={`0 0 ${CANVAS_WIDTH * newRate} ${CANVAS_HEIGHT * newRate}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 畫圖 */}
        {shapes.map((shape) => (
          <CanvasDrawItem
            key={shape.id}
            shape={shape}
            newRate={newRate}
            onPointerDown={(e) => handleShapePointerDown(e, shape)}
          />
        ))}
        {/* 畫圖的外圍 */}
        {selectionOverlay.map((shape) => (
          <CanvasDrawItem
            key={shape.id}
            shape={shape}
            newRate={newRate}
            onPointerDown={(e) => handleShapePointerDown(e, shape)}
          />
        ))}
      </svg>
    </div>
  );
};

export default Canvas;
