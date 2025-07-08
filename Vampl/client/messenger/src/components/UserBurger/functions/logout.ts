import { Dispatch } from "@reduxjs/toolkit";
import checkAuthorization from "../../MainPage/functions/AutoAuthorization";

import queryRequest from "../../global-functions/queryRequest";
import { userApi } from "../../../store/api/baseApi";
import { NavigateFunction } from "react-router";
import { switchBurger, switchUser } from "../../../store/useFullStaff";

const logOut = async (dispatch:Dispatch,navigate:NavigateFunction) => {
   await queryRequest(userApi,'setUserLogOut',{url:'log-out'},dispatch);
   dispatch(switchUser(''));
   dispatch(switchBurger());
   checkAuthorization(dispatch,navigate);
}

export default logOut;