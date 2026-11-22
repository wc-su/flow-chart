import { Outlet, useMatch } from 'react-router';
import clsx from 'clsx';

import Header from '@/components/Header/Header';
import LoadingProvider from '@/components/Loading/LoadingProvider';

import './RootLayout.scss';

const RootLayout = () => {
  const isChartPage = !!useMatch('chart/:chartId?');

  return (
    <LoadingProvider>
      <div className={clsx('rootLayout', isChartPage && 'rootLayout--fixedHeight')}>
        <Header />
        <Outlet />
      </div>
    </LoadingProvider>
  );
};

export default RootLayout;
