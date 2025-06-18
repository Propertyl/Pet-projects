import { Dispatch } from "@reduxjs/toolkit";
import { setData } from "../../../store/user";
import changeTheme from "../../Navigation/functions/changeTheme";
import { switchAccess } from "../../../store/useFullStaff";
import { UserInfo } from "../../types/global";
import { userApi } from "../../../store/api/baseApi";
import { dataApi } from "../../../store/api/dataApi";
import queryRequest from "../../global-functions/queryRequest";

const checkAuthorization = async (dispatch:Dispatch) => {
      const auth:{approve:boolean} = await dispatch(userApi.endpoints.getUserConvenientData.initiate({url:'authorization'},{ forceRefetch: true })).unwrap();

      const months = await queryRequest(dataApi,'getBurgerData',{url:'month/en'},dispatch);
      
      dispatch(setData({field:'allMonths',value:months}));
      dispatch(setData({field:'locale',value:navigator.language ?? 'en-US'}));

      if(!auth.approve && window.location.href.split('/').pop() != 'auth') {
        window.location.href = '/auth';
      } else if(auth.approve) {
        const {name} = await queryRequest(userApi,'getUserConvenientData',{url:'info'},dispatch) as UserInfo;
        const userTheme = await queryRequest(userApi,'getUserConvenientData',{url:'get-theme'},dispatch) as {theme:string};

        changeTheme(userTheme.theme);
        dispatch(setData({field:'userName',value:name}));
        dispatch(switchAccess(true));
      }

}

export default checkAuthorization;