import nameValidation from "../../AuthPage/functions/nameValidation";
import {Dispatch} from "@reduxjs/toolkit";
import { SetDispatch } from "../../types/global";
import { userApi } from "../../../store/api/baseApi";
import queryRequest from "../../global-functions/queryRequest";

const checkName =  async (newName:string,setDataCorrect:SetDispatch<boolean | null>,
dispatch:Dispatch,
popUpMessages?:{
  existing:string;
  incorrect:string;
},
setMessage?:SetDispatch<string>,
currentName?:string,
) => {
  if(currentName && currentName === newName) {
    setDataCorrect(null);
    return;
  }
  if(!newName || !nameValidation(newName)) {
    setMessage(popUpMessages?.incorrect);
    setDataCorrect(false);
    return;
  }

  const response:{existing:boolean} = await queryRequest(userApi,'getUserConvenientData',{url:'check-name-existing',param:newName},dispatch);

  switch(response.existing) {
    case false:
      setDataCorrect(true);
      break;
    case true:
      setMessage(popUpMessages?.existing);
      break;
  }
}

export default checkName;

  