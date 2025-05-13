import { Dispatch } from "@reduxjs/toolkit";
import checkAuthorization from "./AutoAuthorization";
import serv from "./interceptors";

const logOut = async (dispatch:Dispatch) => {
   await serv.put('/user/log-out');
   checkAuthorization(dispatch);
}

export default logOut;