// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';

import { chartActions } from '@/redux/chartSlice';
import { makeStore } from '@/redux/store';
import ToolProvider from '@/pages/Chart/components/Tool/ToolProvider';
import Canvas from './Canvas';
import { SHAPE_TYPE } from '@/utils/shape';

vi.mock('uuid', () => ({ v4: () => 'test-uuid' }));

const renderCanvas = ({ zoom }) => {
  const store = makeStore();
  // 畫一個圖形
  store.dispatch(chartActions.startDraw(100, 120, SHAPE_TYPE.PROCESS));
  store.dispatch(chartActions.draw({ x: 200, y: 250 }));
  const { id } = store.getState().chart.present.shapes[0];
  store.dispatch(chartActions.endDraw({ id }));

  const { container } = render(
    <Provider store={store}>
      <ToolProvider>
        <Canvas zoom={zoom} />
      </ToolProvider>
    </Provider>
  );

  return { store, container };
};

describe('Canvas: 移動不到 4px 當作點一下', () => {
  it('拖曳 1px 不寫入歷史', () => {
    const { container, store } = renderCanvas({ zoom: 100 });

    // SVG 圖形沒有文字、role，Testing Library 的查詢方法找不到，只能用 querySelector
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const shape = container.querySelector('g');

    // 模擬拖曳圖形
    fireEvent.pointerDown(shape, { clientX: 150, clientY: 180 });
    fireEvent.pointerMove(shape, { clientX: 151, clientY: 180 });
    fireEvent.pointerUp(shape);

    // 沒有新紀錄，圖形位置沒變
    const { past, present } = store.getState().chart;
    expect(past).toHaveLength(1); // 只有畫圖那一筆
    expect(present.shapes[0]).toMatchObject({ x: 100, y: 120 }); // 拖曳：位置沒變
  });

  it('縮放 1px 不寫入歷史', () => {
    const { container, store } = renderCanvas({ zoom: 100 });

    // SVG 圖形沒有文字、role，Testing Library 的查詢方法找不到，只能用 querySelector
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const handle = container.querySelector('g[style*="se-resize"]');

    // 模擬拖曳控制點，縮放圖形
    fireEvent.pointerDown(handle, { clientX: 200, clientY: 250 });
    fireEvent.pointerMove(handle, { clientX: 201, clientY: 250 });
    fireEvent.pointerUp(handle);

    // 沒有新紀錄，圖形大小沒變
    const { past, present } = store.getState().chart;
    expect(past).toHaveLength(1); // 只有畫圖那一筆
    expect(present.shapes[0]).toMatchObject({ width: 100, height: 130 }); // 縮放：大小沒變
  });
});
