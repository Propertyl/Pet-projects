import { SetStateAction } from "react";

const useSwitcher = (setOptions:React.Dispatch<SetStateAction<Boolean>>) => {
  return () => setOptions(option => !option);
}

export default useSwitcher;
