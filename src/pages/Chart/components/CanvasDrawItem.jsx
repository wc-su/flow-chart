import Terminal from './shapes/Terminal';
import Process from './shapes/Process';
import InputOutput from './shapes/InputOutput';
import Decision from './shapes/Decision';
import Flowline from './shapes/Flowline';
import Ellipse from './shapes/Ellipse';

const CanvasDrawItem = ({ shape, newRate }) => {
  let drawShape;
  switch (shape.type) {
    case 'terminal':
      drawShape = <Terminal shape={shape} newRate={newRate} />;
      break;
    case 'process':
      drawShape = <Process shape={shape} newRate={newRate} />;
      break;
    case 'inputOutput':
      drawShape = <InputOutput shape={shape} newRate={newRate} />;
      break;
    case 'decision':
      drawShape = <Decision shape={shape} newRate={newRate} />;
      break;
    case 'flowline':
      drawShape = <Flowline shape={shape} newRate={newRate} />;
      break;
    case 'ellipse':
      drawShape = <Ellipse shape={shape} newRate={newRate} />;
      break;
  }

  return (
    <g
      style={{
        cursor: ['start-resize', 'end-resize'].includes(shape.cursor) ? 'pointer' : shape.cursor,
        display: shape.display,
      }}
    >
      {drawShape}
    </g>
  );
};

export default CanvasDrawItem;
