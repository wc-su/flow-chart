// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { userActions } from '../../redux/userSlice';

import routes from '../../router/routes';
import { makeStore } from '../../redux/store';

vi.mock('react-device-detect', () => ({ isMobile: true }));

// 用指定的網址畫出整個 App
const renderRoute = (url, { loggedIn = false } = {}) => {
  const store = makeStore();
  if (loggedIn) store.dispatch(userActions.login());

  const router = createMemoryRouter(routes, { initialEntries: [url] });
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe('Chart 手機版測試', () => {
  it('手機版沒登入：連結回到首頁', async () => {
    renderRoute('/chart');
    expect(await screen.findByRole('link', { name: '回到首頁' })).toHaveAttribute('href', '/');
  });

  it('手機版已登入：連結回到檔案列表', async () => {
    renderRoute('/chart', { loggedIn: true });
    expect(await screen.findByRole('link', { name: '回到檔案列表' })).toHaveAttribute('href', '/files');
  });

  it('手機時出現提示，沒有工具列', async () => {
    renderRoute('/chart');
    expect(await screen.findByText('Sorry!')).toBeInTheDocument(); // 先確認畫面畫出來了
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); // 標題輸入框不在
  });
});
