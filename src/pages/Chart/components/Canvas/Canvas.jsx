import { useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';

import { chartActions, selectShapes, selectSelectionOverlay } from '@/redux/chartSlice';
import { isEmptyShape, toCanvasPoint } from '@/utils/shape';
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

  const { tool, setTool } = useTool();

  const shapes = useSelector(selectShapes);
  const selectionOverlay = useSelector(selectSelectionOverlay);

  const newRate = 1;

  function handlePointerDown(e) {
    if (e.button !== 0) return;

    if (tool && tool !== TOOL.MOVE) {
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
    }
  }

  function handlePointerUp() {
    if (drawStatus.current === DRAW_STATUS.DRAWING) {
      const latest = selectShapes(store.getState());
      const { type, width, height } = latest[latest.length - 1];
      if (isEmptyShape(type, width, height)) {
        // 移除畫的那筆
        // TODO: 需要有提示訊息嗎？
        dispatch(chartActions.cancelDraw());
      } else {
        dispatch(chartActions.endDraw());
      }
      drawStatus.current = DRAW_STATUS.IDLE;
      setTool(null);
    }
  }

  return (
    <div
      className="canvas"
      style={{
        top: 0,
        left: 0,
        width: 600 * newRate,
        height: 800 * newRate,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        width={600 * newRate}
        height={800 * newRate}
        viewBox={`0 0 ${600 * newRate} ${800 * newRate}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 畫圖 */}
        {shapes.map((shape) => (
          <CanvasDrawItem key={shape.id} shape={shape} newRate={newRate} />
        ))}
        {/* 畫圖的外圍 */}
        {selectionOverlay.map((shape) => (
          <CanvasDrawItem key={shape.id} shape={shape} newRate={newRate} />
        ))}
      </svg>
    </div>
  );
};

export default Canvas;
