import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router';

import ToolButton from './ToolButton';
import ToolDropdown from './ToolDropdown';
import { USER_STATUS } from '@/redux/userSlice';
import { selectCanUndo, selectCanRedo, selectSelectedId } from '@/redux/chartSlice';
import { useTool } from './Tool/ToolContext';
import { TOOL } from './Tool/tool';

import './CanvasToolBar.scss';

import terminalIcon from '../images/terminal.png';
import processIcon from '../images/process.png';
import inputOutputIcon from '../images/inputOutput.png';
import decisionIcon from '../images/decision.png';
import flowlineIcon from '../images/flowline.png';
import saveAsJPGIcon from '../images/save-as-jpg.png';
import saveAsPNGIcon from '../images/save-as-png.png';
import backIcon from '../images/back-files.png';
import moveIcon from '../images/canvas-move.png';
import undoIcon from '../images/back-step.png';
import redoIcon from '../images/next-step.png';
import deleteIcon from '../images/delete.png';
import uploadIcon from '../images/upload.png';
import zoomInIcon from '../images/zoom-in.png';
import zoomOutIcon from '../images/zoom-out.png';

const DRAW_OPTIONS = Object.freeze([
  { value: TOOL.TERMINAL, icon: terminalIcon, label: 'Terminal' },
  { value: TOOL.PROCESS, icon: processIcon, label: 'Process' },
  { value: TOOL.INPUTOUTPUT, icon: inputOutputIcon, label: 'Input / Output' },
  { value: TOOL.DECISION, icon: decisionIcon, label: 'Decision' },
  { value: TOOL.FLOWLINE, icon: flowlineIcon, label: 'Flowline' },
]);

const SAVE_OPTIONS = Object.freeze([
  { value: 'png', icon: saveAsPNGIcon, label: 'PNG' },
  { value: 'jpg', icon: saveAsJPGIcon, label: 'JPG' },
]);

const CanvasToolBar = ({
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  title,
  onTitleChange,
  onUpload,
  onExport,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.user);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const selectedId = useSelector(selectSelectedId);

  const { tool, setTool } = useTool();

  const [openDropdown, setOpenDropdown] = useState(null); // null | 'draw' | 'save'

  function handleToggleDropdown(type) {
    setOpenDropdown((prev) => (prev === type ? null : type));
  }

  return (
    <div className="canvasToolBar">
      <div className="canvasToolBar__container">
        <ToolButton
          icon={backIcon}
          label="back Files"
          disabled={status !== USER_STATUS.LOGGED_IN}
          onClick={() => navigate('/files')}
        />
        <div className="canvasToolBar__separator"></div>
        <ToolButton
          icon={moveIcon}
          label="move"
          active={tool === TOOL.MOVE}
          disabled={isMobile}
          onClick={() => setTool(tool === TOOL.MOVE ? null : TOOL.MOVE)}
        />
        <ToolDropdown
          options={DRAW_OPTIONS}
          active={DRAW_OPTIONS.some((option) => option.value === tool)}
          disabled={isMobile}
          onSelect={(option) => setTool(option.value)}
          isOpen={openDropdown === 'draw'}
          onClose={() => setOpenDropdown(null)}
          onToggle={() => handleToggleDropdown('draw')}
        />
        <ToolButton
          icon={undoIcon}
          label="undo"
          disabled={isMobile || !canUndo}
          onClick={() => dispatch(ActionCreators.undo())}
        />
        <ToolButton
          icon={redoIcon}
          label="redo"
          disabled={isMobile || !canRedo}
          onClick={() => dispatch(ActionCreators.redo())}
        />
        <ToolButton icon={deleteIcon} label="delete" disabled={isMobile || selectedId === null} />
      </div>
      <div className="canvasToolBar__container">
        <input
          type="text"
          maxLength="20"
          className="canvasToolBar__title"
          value={title}
          placeholder="未命名"
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={isMobile}
        />
      </div>
      <div className="canvasToolBar__container">
        <ToolButton
          icon={uploadIcon}
          label="upload"
          disabled={isMobile || status !== USER_STATUS.LOGGED_IN}
          onClick={onUpload}
        />
        <ToolDropdown
          options={SAVE_OPTIONS}
          disabled={isMobile}
          onSelect={(option) => onExport(option.value)}
          isOpen={openDropdown === 'save'}
          onClose={() => setOpenDropdown(null)}
          onToggle={() => handleToggleDropdown('save')}
        />
        <ToolButton icon={zoomInIcon} label="zoomIn" disabled={isMobile || !canZoomIn} onClick={onZoomIn} />
        <ToolButton icon={zoomOutIcon} label="zoomOut" disabled={isMobile || !canZoomOut} onClick={onZoomOut} />
        <p className="canvasToolBar__percent">{zoom} %</p>
      </div>
    </div>
  );
};

export default CanvasToolBar;
