import App from "@/components/App";
import { Spy } from "@/pages";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const routes = [
{
  path:'/spy',
  element:<App/>,
  chidlren:[
    {
      path:'/spy',
      element:<Suspense fallback={<div>Loading...</div>}><Spy/></Suspense>
    },
  ]
}
];


export const router = createBrowserRouter(routes);

export default routes;
