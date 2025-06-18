// import serv from "../../global-functions/interceptors";
import nameValidation from "../../AuthPage/functions/nameValidation";
import {Dispatch} from "@reduxjs/toolkit";
import { SetDispatch } from "../../types/global";
import { userApi } from "../../../store/api/baseApi";
import queryRequest from "../../global-functions/queryRequest";

const checkName =  async (newName:string,setDataCorrect:SetDispatch<boolean | null>,
dispatch:Dispatch,
currentName?:string
) => {
  if(currentName && currentName === newName) {
    setDataCorrect(null);
    return;
  }
  if(!newName || !nameValidation(newName)) {
    setDataCorrect(null);
    return;
  }


  const response:{existing:boolean} = await queryRequest(userApi,'getUserConvenientData',{url:'check-name-existing',param:newName},dispatch);

  setDataCorrect(!response.existing);
}

export default checkName;

  