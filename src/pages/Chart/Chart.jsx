import { useState } from 'react';
import { MobileView } from 'react-device-detect';

import CanvasToolBar from './components/CanvasToolBar';
import Canvas from './components/Canvas';
import ToolProvider from './components/Tool/ToolProvider';

import './Chart.scss';

const Chart = () => {
  const [toolBarPop, setToolBarPop] = useState('');

  function handleMainClick() {
    setToolBarPop('');
  }

  return (
    <main className="chart">
      <ToolProvider>
        <CanvasToolBar toolBarPop={toolBarPop} setToolBarPop={setToolBarPop} />
        <div className="chart__main" onClick={handleMainClick}>
          <Canvas />
        </div>
        <MobileView className="chart-prompt">
          <div className="chart-prompt__container">
            <p className="chart-prompt__title">Sorry!</p>
            <p className="chart-prompt__message">手機及平板尚不支援該功能，請改於電腦上操作，謝謝。</p>
          </div>
        </MobileView>
      </ToolProvider>
    </main>
  );
};

export default Chart;
