import { Outlet } from 'react-router';

import Header from '@/components/Header/Header';
import LoadingProvider from '@/components/Loading/LoadingProvider';

import './RootLayout.scss';

const RootLayout = () => {
  return (
    <LoadingProvider>
      <div className="rootLayout">
        <Header />
        <Outlet />
      </div>
    </LoadingProvider>
  );
};

export default RootLayout;
