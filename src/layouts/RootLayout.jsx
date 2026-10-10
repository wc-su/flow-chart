import { Outlet } from 'react-router';

import Header from '../components/Header/Header';
import LoadingProvider from '../components/Loading/LoadingProvider';

const RootLayout = () => {
  return (
    <LoadingProvider>
      <Header />
      <Outlet />
    </LoadingProvider>
  );
};

export default RootLayout;
