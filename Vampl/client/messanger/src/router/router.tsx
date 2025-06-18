import { createBrowserRouter } from 'react-router-dom';
import AuthPage from '../components/AuthPage/AuthPage';
import MainPage from '../components/MainPage/MainPage';

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