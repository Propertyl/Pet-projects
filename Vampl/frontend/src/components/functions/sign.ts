import type { Ref } from "vue";
import type { SignData } from "../../types/global";
import bcrypt from "bcryptjs";

const auth = async (register:Ref<Boolean>,inputData:SignData | any,userIp:string) => {
  if(!register.value) {
    inputData['ip'] = userIp;
    inputData['password'] = await bcrypt.hash(inputData['password'],10);
      await fetch('http://localhost:3000/user/createAccount',{
        method:"POST",
        headers:{
          "Content-Type":'application/json'
        },
        body:JSON.stringify(inputData)
      });
      await fetch('http://localhost:3000/user/setAuthorized',{
        method:'PUT',
        headers: {
         "Content-Type":'application/json'
        },
        body:JSON.stringify({ip:inputData.ip})
      });
      return {router: '/'};
  } else {
    const req = await fetch(`http://localhost:3000/user/verifyAccount/${inputData['phone']}`)
    .then(data => data.json());
    console.log('entered:',req);
    if(await bcrypt.compare(inputData['password'],req.password)) {
      await fetch('http://localhost:3000/user/setAuthorized',{
        method:'PUT',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({ip:inputData.ip})
      });
      return {router: '/'};
    } else {
     return {window:'phone'};
    }
  }
}

export default auth;