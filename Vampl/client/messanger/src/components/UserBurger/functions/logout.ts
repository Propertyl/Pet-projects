import { Dispatch } from "@reduxjs/toolkit";
import checkAuthorization from "../../MainPage/functions/AutoAuthorization";

import queryRequest from "../../global-functions/queryRequest";
import { userApi } from "../../../store/api/baseApi";

const logOut = async (dispatch:Dispatch) => {
   await queryRequest(userApi,'setUserLogOut',{url:'log-out'},dispatch);
   checkAuthorization(dispatch);
}

export default logOut;