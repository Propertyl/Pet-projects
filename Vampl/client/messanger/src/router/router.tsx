import { createBrowserRouter } from 'react-router-dom';
import MainApp from '../App';

const router:any = createBrowserRouter([
  {
    path: '/',
    element: <MainApp />
  },
  // {
  //   path: '/auth',
  //   element: <Auth /> // ✅ must be a component
  // }
]);

export default router;