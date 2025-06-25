import { Dispatch } from "@reduxjs/toolkit";
import { setData } from "../../../store/user";
import changeTheme from "../../Navigation/functions/changeTheme";
import { switchAccess } from "../../../store/useFullStaff";
import { UserInfo } from "../../types/global";
import { userApi } from "../../../store/api/baseApi";
import { dataApi } from "../../../store/api/dataApi";
import queryRequest from "../../global-functions/queryRequest";
import { NavigateFunction } from "react-router";

const checkAuthorization = async (dispatch:Dispatch,navigate:NavigateFunction) => {
      const auth:{approve:boolean} = await queryRequest(userApi,'getUserConvenientData',{url:'authorization'},dispatch,true);

      const months = await queryRequest(dataApi,'getSomeData',{url:'month',param:navigator.language},dispatch);
      
      dispatch(setData({field:'allMonths',value:months}));
      dispatch(setData({field:'locale',value:navigator.language ?? 'en-US'}));

      if(!auth.approve) {
        navigate('/auth');
      } else if(auth.approve) {
        const currentLink = window.location.href;
        if(!/[#@]/g.test(currentLink)) {
          navigate('/');
        }
        const {name} = await queryRequest(userApi,'getUserConvenientData',{url:'info'},dispatch) as UserInfo;
        const userTheme = await queryRequest(userApi,'getUserConvenientData',{url:'get-theme'},dispatch) as {theme:string};

        changeTheme(userTheme.theme);
        dispatch(setData({field:'userName',value:name}));
        dispatch(switchAccess(true));
      }

}

export default checkAuthorization;