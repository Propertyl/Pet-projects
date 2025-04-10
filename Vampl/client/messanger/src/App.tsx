import { useEffect, useState } from 'react'
import changeTheme from './components/functions/changeTheme';
import type { UserInfo } from './components/types/global';
import serv from './components/functions/interceptors';
import {useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setData } from './store/user';
import Navigation from './components/Navigation';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
// const router = useRo;

useEffect(() => {
    const startApplication = async () => {
      // const user = window.location.href.split('#').pop();
      const authInfo:UserInfo = await serv.get(`/user/getAuthData/${false}`);
      const currentTheme:{theme:string} = await serv.get(`/user/get-theme/${authInfo.ip}`);

      changeTheme(currentTheme.theme);
      const months = await serv.get('/getData/month/en');
      
      dispatch(setData({field:'allMonth',value:months}));
      dispatch(setData({field:'ip',value:authInfo.ip}));
      dispatch(setData({field:'locale',value:navigator.language}));

      if(!authInfo.authorized) {
        navigate('/auth');
        return;
      }

      const userInfo = await serv.get(`/user/infoByIp/${authInfo.ip}`);

      dispatch(setData({field:'additionalData',value:userInfo}));
    }

    startApplication();
 },[])

  return (
    <>
      <header>
        <Navigation/>
      </header>
      <main>

      </main>
    </>
  )
}

export default App
