import { useState, useRef, useEffect } from 'react';

import ToolButton from './ToolButton';

import './ToolDropdown.scss';

import selectIcon from './images/down.png';

const ToolDropdown = ({ options, active, disabled, onMainClick, onSelect, isOpen, onClose, onToggle }) => {
  const rootRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return; // 關著的時候不監聽

    function handlePointerDown(e) {
      // contains: e.target (被點到的元素) 是不是在 rootRef 這個 div 裡面
      if (!rootRef.current.contains(e.target)) {
        onClose();
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    // 第三個參數 true: 改成在捕獲階段監聽，事件往內傳時 document 會先收到
    // 用冒泡階段的話，點到圖形時 Canvas 的 stopPropagation 會擋住事件，這邊選單不會關閉
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      // cleanup: 選單關閉或元件消失時移除，不然監聽會一直留著
      // 移除時也要傳 true，和加的時候一致才可以移除
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  function selectOption(callback, index) {
    setSelectedIndex(index);
    onClose();
    callback(options[index]);
  }

  return (
    <div className="toolDropdown" ref={rootRef}>
      <ToolButton
        className="toolDropdown__main"
        icon={options[selectedIndex].icon}
        label={options[selectedIndex].label}
        active={active}
        disabled={disabled}
        onClick={() => selectOption(onMainClick, selectedIndex)}
      />
      <ToolButton className="toolDropdown__toggle" active={active} disabled={disabled} onClick={onToggle}>
        <img className="toolDropdown__arrow" src={selectIcon} alt="select" />
      </ToolButton>
      {isOpen && (
        <div className="toolDropdown__menu">
          {options.map((item, index) => (
            <button
              type="button"
              className="toolDropdown__option"
              key={item.value}
              onClick={() => selectOption(onSelect, index)}
            >
              <img className="toolDropdown__optionImg" src={item.icon} alt="" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolDropdown;
