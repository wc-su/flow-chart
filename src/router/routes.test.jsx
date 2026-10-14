// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';

import routes from './routes';
import { makeStore } from '../redux/store';

// 用指定的網址畫出整個 App
const renderRoute = (url) => {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  render(
    <Provider store={makeStore()}>
      <RouterProvider router={router} />
    </Provider>
  );
};

describe('路由', () => {
  it('/ 顯示首頁', async () => {
    renderRoute('/');
    expect(await screen.findByRole('heading', { level: 1, name: /draw a flowchart/i })).toBeInTheDocument();
  });

  it('/files 顯示 Files', async () => {
    renderRoute('/files');
    expect(await screen.findByRole('heading', { level: 1, name: 'Files' })).toBeInTheDocument();
  });

  it('/chart 顯示 Chart (沒有 id)', async () => {
    renderRoute('/chart');
    expect(await screen.findByRole('heading', { level: 1, name: 'Chart' })).toBeInTheDocument();
  });

  it('/chart/:chartId 顯示 Chart，拿得到 chartId', async () => {
    renderRoute('/chart/b85b459a-c983-d2ee-796c-22f570089bf9');
    expect(await screen.findByRole('heading', { level: 1, name: 'Chart' })).toBeInTheDocument();
    // 測試 chartId 的值
    expect(screen.getByText('b85b459a-c983-d2ee-796c-22f570089bf9')).toBeInTheDocument();
  });

  it('不存在的網址顯示 404 而且有 Header', async () => {
    renderRoute('/123');
    // path: '*' 放在 RootLayout 底下，404 也要有 Header
    expect(await screen.findByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'NotFound' })).toBeInTheDocument();
  });
});
