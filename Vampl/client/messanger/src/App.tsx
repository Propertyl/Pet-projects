import {useLayoutEffect} from 'react'
import {RouterProvider } from 'react-router';
import { useDispatch} from 'react-redux';
import router from './router/router';
import checkAuthorization from './components/functions/AutoAuthorization';

function App() {
  const dispatch = useDispatch();
  
  useLayoutEffect(() => {
    checkAuthorization(dispatch);
  },[dispatch])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
