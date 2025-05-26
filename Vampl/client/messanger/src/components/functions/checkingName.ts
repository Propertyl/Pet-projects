import { Dispatch, SetStateAction } from "react";
import serv from "./interceptors";
import nameValidation from "./nameValidation";

const checkName =  async (newName:string,setDataCorrect:Dispatch<SetStateAction<boolean | null>>,
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

  const response:{existing:boolean} = await serv.get(`/user/check-name-existing/${newName}`);

  setDataCorrect(!response.existing);
}

export default checkName;

  