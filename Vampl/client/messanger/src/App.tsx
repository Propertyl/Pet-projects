import { useEffect, useLayoutEffect} from 'react'
import changeTheme from './components/functions/changeTheme';
import serv from './components/functions/interceptors';
import {RouterProvider } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from './store/user';
import { Store,UserInfo } from './types/global';
import router from './router/router';
import { switchAccess } from './store/useFullStaff';

function App() {
  const dispatch = useDispatch();
  const title = useSelector((state:Store) => state.stuff.title);

  useEffect(() => {
    document.title = title;
  },[title])
  
  useLayoutEffect(() => {
    const startApplication = async () => {
      const auth:{approve:boolean} = await serv.get('/user/authorization');

      const months = await serv.get('/getData/month/en');
      
      dispatch(setData({field:'allMonth',value:months}));
      dispatch(setData({field:'locale',value:navigator.language ?? 'en-US'}));

      if(!auth.approve && window.location.href.split('/').pop() != 'auth') {
        window.location.href = '/auth';
      } else if(auth.approve) {
        const {name} = await serv.get('/user/info') as UserInfo;
        const userTheme = await serv.get('/user/get-theme') as {theme:string};

        changeTheme(userTheme.theme);
        dispatch(setData({field:'userName',value:name}));
        dispatch(switchAccess(true));
      }

    }

    startApplication().then();
 },[dispatch])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
