// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import ToolDropdown from './ToolDropdown';

const OPTIONS = [
  { value: 'png', icon: 'png.png', label: 'PNG' },
  { value: 'jpg', icon: 'jpg.png', label: 'JPG' },
];

// 每個測試都建立新的 onClose，記錄才不會被上一個測試影響
const renderDropdown = ({ isOpen }) => {
  const onClose = vi.fn();
  const props = { options: OPTIONS, onClose, onSelect: vi.fn(), onToggle: vi.fn() };

  const { rerender } = render(<ToolDropdown {...props} isOpen={isOpen} />);
  // 用同一組 props 重新渲染，只換 isOpen
  const setIsOpen = (nextIsOpen) => rerender(<ToolDropdown {...props} isOpen={nextIsOpen} />);

  return { onClose, setIsOpen };
};

describe('ToolDropdown', () => {
  it('打開時點外面，呼叫 onClose', () => {
    const { onClose } = renderDropdown({ isOpen: true });

    fireEvent.pointerDown(document.body);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('打開時點箭頭，不呼叫 onClose', () => {
    const { onClose } = renderDropdown({ isOpen: true });

    fireEvent.pointerDown(screen.getByAltText('select'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('打開時按 Esc，呼叫 onClose', () => {
    const { onClose } = renderDropdown({ isOpen: true });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('打開後關閉，點外面不呼叫 onClose', () => {
    const { onClose, setIsOpen } = renderDropdown({ isOpen: true });

    setIsOpen(false);
    fireEvent.pointerDown(document.body);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('一開始就關著，點外面不呼叫 onClose', () => {
    const { onClose } = renderDropdown({ isOpen: false });

    fireEvent.pointerDown(document.body);

    expect(onClose).not.toHaveBeenCalled();
  });
});
