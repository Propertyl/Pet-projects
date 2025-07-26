import { createBrowserRouter } from "react-router-dom"
import { App } from "@/components/App/App";
import { Suspense } from "react";
import { Home } from "@/pages";
//@ts-ignore
import spyRoutes from 'spy/Router';
import { LoadingScreen } from "@packages/shared";

const routes = [{
  path:'/',
  element:<App/>,
  children:[
    {
       path:'/',
       element:<Suspense fallback={<LoadingScreen/>}><Home/></Suspense>
    },
    ...spyRoutes
  ]
}];

export const router = createBrowserRouter(routes);

export default routes;