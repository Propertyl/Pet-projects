import { SetDispatch } from "../../types/global";

const checkValueForUpdate = (condition:unknown,setDataCorrect:SetDispatch<boolean | null>,setMessage?:SetDispatch<string>,message?:string) => {
  if(condition) {
    setDataCorrect(true);
    return;
  } else {
    setMessage(message);
  }

  setDataCorrect(false);
}
 
export default checkValueForUpdate;