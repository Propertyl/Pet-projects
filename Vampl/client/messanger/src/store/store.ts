import { configureStore } from "@reduxjs/toolkit";
import useUserData from "./user";
import useUsefulStuff from './useFullStaff';
const store = configureStore({
  reducer:{
    user:useUserData,
    stuff:useUsefulStuff
  },
});

export default store;