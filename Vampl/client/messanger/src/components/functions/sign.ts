import type { SignData } from "../types/global";
import bcrypt from "bcryptjs";
import serv from "./interceptors";

const setAuthorized = async (phone:string) => {
  await serv.put('/user/setAuthorized',{
    headers: {
      'Content-Type':'application/json'
    },
    phone:phone
  });
}

const createAccount = async (inputData:SignData | any) => {
  await serv.post('/user/create-theme',{
    phone:inputData['phone']
  });
  await serv.post('/user/createAccount',{
    ...inputData
  });
  await setAuthorized(inputData['phone']);

  return true;
}

const auth = async (register:Boolean,inputData:SignData | any) => {
  if(!register) {
    inputData['password'] = await bcrypt.hash(inputData['password'],10);
    return createAccount(inputData);
  } else {
    console.log("start:",register,inputData);
    const req:any = await serv.get(`/user/verifyAccount/${inputData['phone']}`);
    if(await bcrypt.compare(inputData['password'],req.password)) {
      await setAuthorized(inputData['phone']);
      return true;
    }

    return false;
  }
}

export default auth;