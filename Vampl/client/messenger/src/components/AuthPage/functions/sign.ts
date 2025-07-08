import { Dispatch } from "@reduxjs/toolkit";
import type { SignData } from "../../types/global";
import bcrypt from "bcryptjs";
import { userApi } from "../../../store/api/baseApi";
import queryRequest from "../../global-functions/queryRequest";
// import serv from "../../global-functions/interceptors";

const setAuthorized = async (phone:string,dispatch:Dispatch) => {
  await queryRequest(userApi,'setUserAuthorized',{url:'',param:{phone:phone}},dispatch);
}

const createAccount = async (inputData:SignData | any,dispatch:Dispatch) => {
  await queryRequest(userApi,'createUserData',{url:'create-theme',param:{phone:inputData.phone}},dispatch);
  await queryRequest(userApi,'createUserData',{url:'createAccount',param:{...inputData}},dispatch);
  await setAuthorized(inputData['phone'],dispatch);

  return true;
}

const auth = async (register:Boolean,inputData:SignData | any,dispatch:Dispatch) => {
  if(!register) {
    inputData['password'] = await bcrypt.hash(inputData['password'],10);
    return createAccount(inputData,dispatch);
  }
  
  console.log('input:',inputData);
  const req = await queryRequest(userApi,'getUserConvenientData',{url:'verifyAccount',param:inputData.phone},dispatch);
  const passwordCorrect = await bcrypt.compare(inputData['password'],req.password);

  if(passwordCorrect) {
    await setAuthorized(inputData['phone'],dispatch);
    return true;
  }
  return false;
}

export default auth;