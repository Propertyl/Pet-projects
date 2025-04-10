import { createBrowserRouter } from 'react-router-dom';
import MainApp from '../App';
import AuthPage from '../pages/AuthPage';

const router:any = createBrowserRouter([
  {
    path: '/',
    element: <MainApp />
  },
  {
    path: '/auth',
    element: <AuthPage />
  }
]);

export default router;