import clsx from 'clsx';

import './ToolButton.scss';

const ToolButton = ({ className, icon, label, active, disabled, onClick, children }) => {
  return (
    <button
      type="button"
      className={clsx('toolButton', active && 'toolButton--active', className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children ?? <img className="toolButton__img" src={icon} alt={label} />}
    </button>
  );
};

export default ToolButton;
