import { useState } from 'react';
import { MobileView } from 'react-device-detect';

import CanvasToolBar from './components/CanvasToolBar';
import Canvas from './components/Canvas';
import DrawTypeProvider from './components/DrawType/DrawTypeProvider';

import './Chart.scss';

const Chart = () => {
  const [toolBarPop, setToolBarPop] = useState('');
  const [activeButton, setActiveButton] = useState({});

  function handleMainClick() {
    setToolBarPop('');
  }

  return (
    <main className="chart">
      <DrawTypeProvider>
        <CanvasToolBar
          // canvasRate={canvasRate}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          toolBarPop={toolBarPop}
          setToolBarPop={setToolBarPop}
          // docTitle={docTitle}
          // docTitleInitFlag={docTitleInitFlag}
        />
        <div className="chart__main" onClick={handleMainClick}>
          <Canvas
            // canvasRate={canvasRate}
            // moveCanvas={moveCanvas}
            setActiveButton={setActiveButton}
          />
        </div>
        <MobileView className="chart-prompt">
          <div className="chart-prompt__container">
            <p className="chart-prompt__title">Sorry!</p>
            <p className="chart-prompt__message">手機及平板尚不支援該功能，請改於電腦上操作，謝謝。</p>
          </div>
        </MobileView>
      </DrawTypeProvider>
    </main>
  );
};

export default Chart;
