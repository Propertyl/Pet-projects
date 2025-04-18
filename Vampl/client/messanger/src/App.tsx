import { useEffect, useLayoutEffect } from 'react'
import changeTheme from './components/functions/changeTheme';
import type { UserInfo } from './components/types/global';
import serv from './components/functions/interceptors';
import {RouterProvider } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from './store/user';
import { Store } from './types/global';
import router from './router/router';

function App() {
  const dispatch = useDispatch();
  const title = useSelector((state:Store) => state.stuff.title);

  useEffect(() => {
    document.title = title;
  },[title])
  
  useLayoutEffect(() => {
    const startApplication = async () => {
      // const user = window.location.href.split('#').pop();
      // const authInfo:UserInfo = await serv.get(`/user/getAuthData/${false}`);
      const auth:any = await serv.get('/user/authorization');
      const Ip = await serv.get('/user/getUserIP');

      const months = await serv.get('/getData/month/en');
      
      dispatch(setData({field:'allMonth',value:months}));
      dispatch(setData({field:'locale',value:navigator.language ?? 'en-US'}));
      dispatch(setData({field:'ip',value:Ip}));

      if(!auth.approve && window.location.href.split('/').pop() != 'auth') {
        window.location.href = '/auth';
      } else if(auth.approve) {
        const userInfo:any = await serv.get(`/user/infoByIp/${Ip}`);
        const userTheme:any = await serv.get(`/user/get-theme/${userInfo.phone}`);

        changeTheme(userTheme.theme);
        dispatch(setData({field:'phone',value:userInfo.phone}));
        dispatch(setData({field:'additionalData',value:userInfo}));
      }

    }

    startApplication();
 },[])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
