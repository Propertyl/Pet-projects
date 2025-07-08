import {RouterProvider } from 'react-router';
import router from './router/router';
import { useLayoutEffect } from 'react';
import changeHTMLlang from './components/global-functions/changeGlobalLang';

function App() {

  useLayoutEffect(() => {
    changeHTMLlang();
  },[]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
