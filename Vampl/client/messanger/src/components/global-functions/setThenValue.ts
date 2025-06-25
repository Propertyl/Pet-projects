import { SetDispatch } from "../types/global";

const saveValue = <T,>(setValue:SetDispatch<T>) => (data:T) => {
  if(data) {
    setValue(data);
  } else {
    throw new Error('data is missing!');
  }
}

export default saveValue;