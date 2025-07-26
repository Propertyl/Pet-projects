import { createRoot } from "react-dom/client";
import {RouterProvider } from "react-router-dom";
import { router } from "./router/Router";
import { defineRootProperties } from "@packages/shared";

const root = document.getElementById("root");

defineRootProperties(root);

if(!root){
   throw new Error("root not found");
} 

const container = createRoot(root);



container.render(<RouterProvider router={router} />);