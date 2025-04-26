import { configureStore } from "@reduxjs/toolkit";
import useUserData from "./user";
import useUsefulStuff from './useFullStaff';       
import useUserChat from './chat';
const store = configureStore({
  reducer:{
    user:useUserData,
    stuff:useUsefulStuff,
    chat:useUserChat
  },
});

export default store;