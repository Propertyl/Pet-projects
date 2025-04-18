import type { SignData } from "../types/global";
import bcrypt from "bcryptjs";
import serv from "./interceptors";

const setAuthorized = async () => {
  await serv.put('/user/setAuthorized',{
    headers: {
      'Content-Type':'application/json'
    },
  });
  return;
}

const createAccount = async (inputData:SignData | any) => {
  await serv.post('/user/create-theme',{
    phone:inputData['phone']
  });
  await serv.post('/user/createAccount',{
    ...inputData
  });
  await setAuthorized();
}

const auth = async (register:Boolean,inputData:SignData | any) => {
  if(!register) {
    inputData['password'] = await bcrypt.hash(inputData['password'],10);
    createAccount(inputData);
    return true;
  } else {
    console.log("start:",register,inputData);
    const req:any = await serv.get(`/user/verifyAccount/${inputData['phone']}`);
    if(await bcrypt.compare(inputData['password'],req.password)) {
      await setAuthorized();
      return true;
    } else {
      return false;
    }
  }
}

export default auth;