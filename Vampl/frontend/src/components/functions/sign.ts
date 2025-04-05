import type { Ref } from "vue";
import type { SignData } from "../../types/global";
import bcrypt from "bcryptjs";
import serv from "./interceptors";

const setAuthorized = async (ip:string) => {
  await serv.put('/user/setAuthorized',{
    headers: {
      'Content-Type':'application/json'
    },
    ip:ip
  });
  return {router: '/'};
}

const auth = async (register:Ref<Boolean>,inputData:SignData | any,userIp:string) => {
  if(!register.value) {
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
      return {window:'phone'};
    }
  }
}

export default auth;