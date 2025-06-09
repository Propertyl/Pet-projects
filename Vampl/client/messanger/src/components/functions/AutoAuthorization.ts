import { Dispatch } from "@reduxjs/toolkit";
import { setData } from "../../store/user";
import changeTheme from "./changeTheme";
import { switchAccess } from "../../store/useFullStaff";
import { UserInfo } from "../types/global";
import { userApi } from "../../store/api/baseApi";
import { dataApi } from "../../store/api/dataApi";

const checkAuthorization = async (dispatch:Dispatch) => {
      const auth:{approve:boolean} = await dispatch(userApi.endpoints.getUserConvenientData.initiate({url:'authorization'})).unwrap();

      const months = await dispatch(dataApi.endpoints.getBurgerData.initiate({url:'month/en'})).unwrap();
      
      dispatch(setData({field:'allMonth',value:months}));
      dispatch(setData({field:'locale',value:navigator.language ?? 'en-US'}));

      if(!auth.approve && window.location.href.split('/').pop() != 'auth') {
        window.location.href = '/auth';
      } else if(auth.approve) {
        const {name} = await dispatch(userApi.endpoints.getUserConvenientData.initiate({url:'info'})).unwrap() as UserInfo;
        const userTheme = await dispatch(userApi.endpoints.getUserConvenientData.initiate({url:'get-theme'})).unwrap() as {theme:string};

        changeTheme(userTheme.theme);
        dispatch(setData({field:'userName',value:name}));
        dispatch(switchAccess(true));
      }

}

export default checkAuthorization;