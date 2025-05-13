import { useEffect, useLayoutEffect} from 'react'
import {RouterProvider } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Store} from './types/global';
import router from './router/router';
import checkAuthorization from './components/functions/AutoAuthorization';

function App() {
  const dispatch = useDispatch();
  const title = useSelector((state:Store) => state.stuff.title);

  useEffect(() => {
    document.title = title;
  },[title])
  
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
