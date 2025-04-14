import { createBrowserRouter } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import MainPage from '../pages/MainPage';

const router:any = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: '/auth',
    element: <AuthPage />
  }
]);

export default router;