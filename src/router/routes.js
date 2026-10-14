import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home/Home';
import Files from '../pages/Files';
import Chart from '../pages/Chart';
import NotFound from '../pages/NotFound';
import RootErrorBoundary from '../components/RootErrorBoundary';

const routes = [
  {
    path: '/',
    ErrorBoundary: RootErrorBoundary,
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'files',
        Component: Files,
      },
      {
        path: 'chart/:chartId?',
        Component: Chart,
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
];

export default routes;
