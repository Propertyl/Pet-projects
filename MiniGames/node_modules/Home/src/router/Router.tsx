import { createBrowserRouter } from "react-router-dom"
import { App } from "@/components/App";
import { Suspense } from "react";
import { Home } from "@/pages";
//@ts-ignore
import spyRoutes from 'spy/Router';

const routes = [{
  path:'/',
  element:<App/>,
  children:[
    {
       path:'/',
       element:<Suspense fallback={<div>Loading...</div>}><Home/></Suspense>
    },
    {
      path:'/second',
      element:<Suspense fallback={<div>Loading...</div>}>SECOND</Suspense>
    },
    ...spyRoutes
  ]
}];

export const router = createBrowserRouter(routes);

export default routes;