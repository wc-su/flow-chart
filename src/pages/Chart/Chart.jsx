import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import { saveSvgAsPng } from 'save-svg-as-png';

import { USER_STATUS } from '@/redux/userSlice';
import CanvasToolBar from './components/CanvasToolBar/CanvasToolBar';
import Canvas from './components/Canvas/Canvas';
import ToolProvider from './components/Tool/ToolProvider';

import './Chart.scss';

const MIN_ZOOM = 50;
const MAX_ZOOM = 300;
const ZOOM_STEP = 10;

const Chart = () => {
  const canvasRef = useRef(null);

  const [zoom, setZoom] = useState(100);
  const [title, setTitle] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { status } = useSelector((state) => state.user);
  const isLoggedIn = status === USER_STATUS.LOGGED_IN;

  function handleUpload() {}

  function handleExport(format) {
    setIsExporting(true);
    const options = { scale: 100 / zoom };
    if (format === 'jpg') {
      options.encoderType = 'image/jpeg';
      options.encoderOptions = 1;
      options.backgroundColor = '#fff';
    }
    saveSvgAsPng(canvasRef.current, title ? title : '未命名', options).finally(() => setIsExporting(false));
  }

  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  }
  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  }

  return (
    <main className="chart">
      {isMobile ? (
        <div className="chart-prompt">
          <div className="chart-prompt__container">
            <p className="chart-prompt__title">Sorry!</p>
            <p className="chart-prompt__message">手機及平板尚不支援該功能，請改於電腦上操作，謝謝。</p>
            <Link to={isLoggedIn ? '/files' : '/'} className="chart-prompt__link">
              {isLoggedIn ? '回到檔案列表' : '回到首頁'}
            </Link>
          </div>
        </div>
      ) : (
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
            <Canvas canvasRef={canvasRef} zoom={zoom} isExporting={isExporting} />
          </div>
        </ToolProvider>
      )}
    </main>
  );
};

export default Chart;
