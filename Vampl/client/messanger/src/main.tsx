import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import store from './store/store.ts'
import { Provider, useSelector } from 'react-redux'
import { RouterProvider } from 'react-router'
import router from './router/router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Provider store={store}>
      <RouterProvider router={router}/>
   </Provider>
  </StrictMode>,
)
