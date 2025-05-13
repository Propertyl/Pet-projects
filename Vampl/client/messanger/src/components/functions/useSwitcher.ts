import { SetStateAction } from "react";

const useSwitcher = (setOptions:React.Dispatch<SetStateAction<boolean>>) => {
  return () => setOptions(option => !option);
}

export default useSwitcher;
