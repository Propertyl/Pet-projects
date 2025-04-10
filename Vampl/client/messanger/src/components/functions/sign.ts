import type { AuthInputs, SignData } from "../types/global";
import bcrypt from "bcryptjs";
import serv from "./interceptors";
import { Dispatch, SetStateAction } from "react";

const setAuthorized = async (ip:string) => {
  await serv.put('/user/setAuthorized',{
    headers: {
      'Content-Type':'application/json'
    },
    ip:ip
  });
  return {router: '/'};
}

const auth = async (register:Boolean,inputData:SignData | any,userIp:string,inputError:AuthInputs | '') => {
  if(!register) {
    inputData['ip'] = userIp;
    inputData['password'] = await bcrypt.hash(inputData['password'],10);
      await serv.post('/user/createAccount',{
        inputData
      });
      return setAuthorized(inputData.ip);
  } else {
    const req:any = await serv.get(`/user/verifyAccount/${inputData['phone']}`);
    console.log('entered:',req);
    if(await bcrypt.compare(inputData['password'],req.password)) {
      return setAuthorized(inputData.ip);
    } else {
      inputError = "incorrect";
      return {window:'password'};
    }
  }
}

export default auth;