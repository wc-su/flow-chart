import { useSelector } from 'react-redux';

import { selectShapes, selectSelectionOverlay } from '@/redux/chartSlice';
import CanvasDrawItem from './CanvasDrawItem';

import './Canvas.scss';

const Canvas = () => {
  const shapes = useSelector(selectShapes);
  const selectionOverlay = useSelector(selectSelectionOverlay);

  const newRate = 1;

  return (
    <div
      className="canvas"
      style={{
        top: 0,
        left: 0,
        width: 600 * newRate,
        height: 800 * newRate,
      }}
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
