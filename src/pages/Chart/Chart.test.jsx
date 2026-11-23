// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import * as rdd from 'react-device-detect';
import { saveSvgAsPng } from 'save-svg-as-png';

import routes from '@/router/routes';
import { makeStore } from '@/redux/store';
import { userActions } from '@/redux/userSlice';

vi.mock('react-device-detect', () => ({
  get isMobile() {
    return false;
  },
}));
vi.mock('save-svg-as-png', () => ({
  saveSvgAsPng: vi.fn(),
}));

// 用指定的網址畫出整個 App
const renderRoute = (url, { loggedIn = false, isMobile = false } = {}) => {
  vi.spyOn(rdd, 'isMobile', 'get').mockReturnValue(isMobile);
  vi.mocked(saveSvgAsPng).mockResolvedValueOnce(undefined);

  const store = makeStore();
  if (loggedIn) store.dispatch(userActions.login());

  const router = createMemoryRouter(routes, { initialEntries: [url] });
  const { container } = render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );

  return { container };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Chart 手機版測試', () => {
  it('手機版沒登入：連結回到首頁', async () => {
    renderRoute('/chart', { isMobile: true });
    expect(await screen.findByRole('link', { name: '回到首頁' })).toHaveAttribute('href', '/');
  });

  it('手機版已登入：連結回到檔案列表', async () => {
    renderRoute('/chart', { loggedIn: true, isMobile: true });
    expect(await screen.findByRole('link', { name: '回到檔案列表' })).toHaveAttribute('href', '/files');
  });

  it('手機時出現提示，沒有工具列', async () => {
    renderRoute('/chart', { isMobile: true });
    expect(await screen.findByText('Sorry!')).toBeInTheDocument(); // 先確認畫面畫出來了
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); // 標題輸入框不在
  });
});

describe('Chart 匯出測試', () => {
  it('直接按匯出主按鈕', async () => {
    const { container } = renderRoute('/chart');

    const mainBtn = await screen.findByRole('button', { name: 'PNG' });
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('.canvas svg');
    const titleInput = screen.getByRole('textbox');

    // 點擊圖片匯出功能
    fireEvent.click(mainBtn);

    expect(titleInput).toHaveValue('');
    expect(saveSvgAsPng).toHaveBeenCalledTimes(1);
    expect(saveSvgAsPng).toHaveBeenCalledWith(svgElement, '未命名', { scale: 1 });
  });

  it('從選單選 JPG 再按主按鈕', async () => {
    const { container } = renderRoute('/chart');
    const selectBtn = await screen.findByRole('button', { name: '匯出選單' });

    // 點擊圖片匯出下拉按鈕
    fireEvent.click(selectBtn);

    const optionBtn = screen.getByRole('button', { name: 'JPG' });

    // 點擊選項 JPG
    fireEvent.click(optionBtn);

    const mainBtn = await screen.findByRole('button', { name: 'JPG' });
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('.canvas svg');

    // 點擊圖片匯出功能
    fireEvent.click(mainBtn);

    expect(saveSvgAsPng).toHaveBeenCalledTimes(1);
    expect(saveSvgAsPng).toHaveBeenCalledWith(svgElement, '未命名', {
      scale: 1,
      backgroundColor: '#fff',
      encoderOptions: 1,
      encoderType: 'image/jpeg',
    });
  });

  it('輸入標題後匯出', async () => {
    const { container } = renderRoute('/chart');

    const mainBtn = await screen.findByRole('button', { name: 'PNG' });
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('.canvas svg');
    const titleInput = screen.getByRole('textbox');

    // 修改標題
    fireEvent.change(titleInput, { target: { value: 'test' } });

    expect(titleInput).toHaveValue('test');

    // 點擊圖片匯出功能
    fireEvent.click(mainBtn);

    expect(saveSvgAsPng).toHaveBeenCalledTimes(1);
    expect(saveSvgAsPng).toHaveBeenCalledWith(svgElement, 'test', { scale: 1 });
  });

  it('放大一次 (110%) 後匯出', async () => {
    const { container } = renderRoute('/chart');

    const zoomInBtn = await screen.findByRole('button', { name: 'zoomIn' });
    const paragraph = screen.getByRole('paragraph');

    // 點擊放大
    fireEvent.click(zoomInBtn);

    expect(paragraph).toHaveTextContent('110 %');

    const mainBtn = screen.getByRole('button', { name: 'PNG' });
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('.canvas svg');
    const titleInput = screen.getByRole('textbox');

    // 點擊圖片匯出功能
    fireEvent.click(mainBtn);

    expect(titleInput).toHaveValue('');
    expect(saveSvgAsPng).toHaveBeenCalledTimes(1);
    expect(saveSvgAsPng).toHaveBeenCalledWith(svgElement, '未命名', { scale: expect.closeTo(0.909, 3) }); // 100/110
  });
});
