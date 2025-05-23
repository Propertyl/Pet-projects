import { Dispatch, SetStateAction } from "react";
import serv from "./interceptors";
import nameValidation from "./nameValidation";

const checkName =  async (currentName:string,setDataCorrect:Dispatch<SetStateAction<boolean | null>>) => {
  if(!currentName || !nameValidation(currentName)) {
    setDataCorrect(null);
    return;
  }

  const response:{existing:boolean} = await serv.get(`/user/check-name-existing/${currentName}`);

  setDataCorrect(!response.existing);
}

export default checkName;

  