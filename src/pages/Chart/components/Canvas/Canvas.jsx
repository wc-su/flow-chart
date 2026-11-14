import { useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import clsx from 'clsx';

import { chartActions, selectShapes, selectSelectionOverlay } from '@/redux/chartSlice';
import { CANVAS_WIDTH, CANVAS_HEIGHT, isEmptyShape, toCanvasPoint, isSameShape } from '@/utils/shape';
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

const Canvas = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const drawStatus = useRef(DRAW_STATUS.IDLE);
  const moveInitData = useRef({});

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
      const distanceX = (e.clientX - moveInitData.current.clientX) / newRate;
      const distanceY = (e.clientY - moveInitData.current.clientY) / newRate;
      dispatch(
        chartActions.moveShape({
          initShape: moveInitData.current.shape,
          distanceX,
          distanceY,
        })
      );
    }
  }

  function handlePointerUp() {
    if (drawStatus.current === DRAW_STATUS.DRAWING) {
      const latest = selectShapes(store.getState());
      const { id, type, width, height } = latest[latest.length - 1];
      if (isEmptyShape(type, width, height)) {
        // 移除畫的那筆
        // TODO: 需要有提示訊息嗎？
        dispatch(chartActions.cancelDraw());
      } else {
        dispatch(chartActions.endDraw({ id }));
      }
      drawStatus.current = DRAW_STATUS.IDLE;
      setTool(null);
    } else if (drawStatus.current === DRAW_STATUS.DRAGGING) {
      const latest = selectShapes(store.getState());
      const { id } = moveInitData.current.shape;
      if (
        !isSameShape(
          moveInitData.current.shape,
          latest.find((shape) => shape.id === id)
        )
      ) {
        dispatch(chartActions.endDraw({ id }));
      }
      drawStatus.current = DRAW_STATUS.IDLE;
    }
  }

  function handleShapePointerDown(e, shape) {
    if (e.button !== 0) return;

    // 擋下事件，不讓它冒泡到畫布的 handlePointerDown 又取消選取
    e.stopPropagation();
    if (shape.type !== 'ellipse') {
      dispatch(chartActions.setSelection({ selectedId: shape.id, activeHandle: '' }));
      // 記住點選圖形的資訊以及滑鼠的座標位置
      drawStatus.current = DRAW_STATUS.DRAGGING;
      moveInitData.current = {
        shape: shape,
        clientX: e.clientX,
        clientY: e.clientY,
      };
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
