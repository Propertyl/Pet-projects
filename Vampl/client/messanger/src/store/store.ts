import { configureStore } from "@reduxjs/toolkit";
import useUserData from "./user";
import useUsefulStuff from './useFullStaff';       
import useUserChat from './chat';
import { userApi } from "./api/baseApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { dataApi } from "./api/dataApi";
import { chatApi } from "./api/chatApi";
const store = configureStore({
  reducer:{
    user:useUserData,
    stuff:useUsefulStuff,
    chat:useUserChat,
    [userApi.reducerPath]:userApi.reducer,
    [dataApi.reducerPath]:dataApi.reducer,
    [chatApi.reducerPath]:chatApi.reducer
  },
  middleware:(getDefaultMiddleware) => 
    getDefaultMiddleware().concat(userApi.middleware,dataApi.middleware,chatApi.middleware),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;

export default store;