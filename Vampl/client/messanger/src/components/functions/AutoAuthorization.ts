import { Dispatch } from "@reduxjs/toolkit";
import { setData } from "../../store/user";
import serv from "./interceptors";
import changeTheme from "./changeTheme";
import { switchAccess } from "../../store/useFullStaff";
import { UserInfo } from "../types/global";

const checkAuthorization = async (dispatch:Dispatch) => {
      const auth:{approve:boolean} = await serv.get('/user/authorization');

      const months = await serv.get('/getData/month/en');
      
      dispatch(setData({field:'allMonth',value:months}));
      dispatch(setData({field:'locale',value:navigator.language ?? 'en-US'}));

      if(!auth.approve && window.location.href.split('/').pop() != 'auth') {
        window.location.href = '/auth';
      } else if(auth.approve) {
        const {name} = await serv.get('/user/info') as UserInfo;
        const userTheme = await serv.get('/user/get-theme') as {theme:string};

        changeTheme(userTheme.theme);
        dispatch(setData({field:'userName',value:name}));
        dispatch(switchAccess(true));
      }

}

export default checkAuthorization;