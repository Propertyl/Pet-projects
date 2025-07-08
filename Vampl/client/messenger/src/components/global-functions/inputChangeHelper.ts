import { SetDispatch } from "../types/global";

const changeValue = (setValue:SetDispatch<string>) => (event:React.ChangeEvent) => {
  const target = event.target as HTMLInputElement;
  return setValue(target.value);
}

export default changeValue;