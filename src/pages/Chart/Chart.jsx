import { useState } from 'react';
import { MobileView } from 'react-device-detect';

import CanvasToolBar from './components/CanvasToolBar';
import Canvas from './components/Canvas';
import ToolProvider from './components/Tool/ToolProvider';

import './Chart.scss';

const MIN_ZOOM = 50;
const MAX_ZOOM = 500;
const ZOOM_STEP = 10;

const Chart = () => {
  const [zoom, setZoom] = useState(100);
  const [title, setTitle] = useState('');

  function handleUpload() {}

  function handleExport() {
    // 之後調整，記得帶入參數 format: handleExport(format)
  }

  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }
  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }

  return (
    <main className="chart">
      <ToolProvider>
        <CanvasToolBar
          zoom={zoom}
          canZoomIn={zoom < MAX_ZOOM}
          canZoomOut={zoom > MIN_ZOOM}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          title={title}
          onTitleChange={setTitle}
          onUpload={handleUpload}
          onExport={handleExport}
        />
        <div className="chart__main">
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
