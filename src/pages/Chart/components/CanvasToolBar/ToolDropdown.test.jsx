// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import ToolDropdown from './ToolDropdown';

const OPTIONS = [
  { value: 'png', icon: 'png.png', label: 'PNG' },
  { value: 'jpg', icon: 'jpg.png', label: 'JPG' },
];

// 每個測試都建立新的 mock 函式，記錄才不會被上一個測試影響
const renderDropdown = ({ isOpen }) => {
  const onClose = vi.fn();
  const onMainClick = vi.fn();
  const onSelect = vi.fn();
  const props = { options: OPTIONS, onClose, onMainClick, onSelect, onToggle: vi.fn() };

  const { rerender } = render(<ToolDropdown {...props} isOpen={isOpen} />);
  // 用同一組 props 重新渲染，只換 isOpen
  const setIsOpen = (nextIsOpen) => rerender(<ToolDropdown {...props} isOpen={nextIsOpen} />);

  return { onClose, onMainClick, onSelect, setIsOpen };
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

  it('打開時點到會 stopPropagation 的元素，呼叫 onClose', () => {
    const { onClose } = renderDropdown({ isOpen: true });

    render(<div onPointerDown={(e) => e.stopPropagation()}>Pointer Target</div>);

    const pointerDiv = screen.getByText('Pointer Target');

    fireEvent.pointerDown(pointerDiv);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('按主按鈕 → 呼叫 onMainClick，不呼叫 onSelect', () => {
    const { onMainClick, onSelect } = renderDropdown({ isOpen: false });

    const mainBtn = screen.getByRole('button', { name: 'PNG' });

    fireEvent.click(mainBtn);

    expect(onMainClick).toHaveBeenCalledTimes(1);
    expect(onMainClick).toHaveBeenCalledWith(OPTIONS[0]);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('選選項 → 呼叫 onSelect，不呼叫 onMainClick', () => {
    const { onMainClick, onSelect } = renderDropdown({ isOpen: true });

    const optionBtn = screen.getByRole('button', { name: 'JPG' });

    fireEvent.click(optionBtn);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(OPTIONS[1]);
    expect(onMainClick).not.toHaveBeenCalled();
  });
});
