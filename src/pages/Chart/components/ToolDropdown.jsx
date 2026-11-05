import { useState } from 'react';

import ToolButton from './ToolButton';

import './ToolDropdown.scss';

import selectIcon from '../images/down.png';

const ToolDropdown = ({ options, active, disabled, onSelect, isOpen, onClose, onToggle }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function changeIndex(index) {
    setSelectedIndex(index);
    onClose();
    onSelect(options[index]);
  }

  return (
    <div className="toolDropdown">
      <ToolButton
        className="toolDropdown__main"
        icon={options[selectedIndex].icon}
        label={options[selectedIndex].label}
        active={active}
        disabled={disabled}
        onClick={() => changeIndex(selectedIndex)}
      />
      <ToolButton className="toolDropdown__toggle" active={active} disabled={disabled} onClick={onToggle}>
        <img className="toolDropdown__arrow" src={selectIcon} alt="select" />
      </ToolButton>
      {isOpen && (
        <div className="toolDropdown__menu">
          {options.map((item, index) => (
            <button type="button" className="toolDropdown__option" key={item.value} onClick={() => changeIndex(index)}>
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
