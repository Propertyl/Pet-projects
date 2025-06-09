import { Dispatch, SetStateAction } from "react";

const saveValue = (setValue:Dispatch<SetStateAction<any>>) => (data:any) => {
  if(data) {
    setValue(data);
  } else {
    throw new Error('data is missing!');
  }
}

export default saveValue;