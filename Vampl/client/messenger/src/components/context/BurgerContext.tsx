import { createContext,ReactNode, useContext, useState } from "react";
import { BurgerInfo, BurgerText, DateValues, SetDispatch } from "../types/global";

type BurgerContextType = {
burgerInfo:BurgerInfo | null,setBurgerInfo:SetDispatch<BurgerInfo | null>,
userBirthDate:DateValues | null,
setUserBirthDate:SetDispatch<DateValues | null>,
pageText:BurgerText | null,
setPageText:SetDispatch<BurgerText | null>,
popUpMessage:string,
setPopUpMessage:SetDispatch<string>
};

const BurgerContext = createContext<BurgerContextType | undefined>(undefined);

const BurgerProvider = ({children}:{children:ReactNode}) => {
  const [burgerInfo,setBurgerInfo] = useState<BurgerInfo | null>(null);
  const [userBirthDate,setUserBirthDate] = useState<DateValues | null>(null);
  const [pageText,setPageText] = useState<BurgerText | null>(null);
  const [popUpMessage,setPopUpMessage] = useState<string>('');

  return (
    <BurgerContext.Provider value={{burgerInfo,setBurgerInfo,userBirthDate,setUserBirthDate,pageText,setPageText,popUpMessage,setPopUpMessage}}>
      {children}
    </BurgerContext.Provider>
  )
}

const useBurgerContext = () => {
  const context = useContext(BurgerContext);
  if(!context) {
    throw new Error("Context undefined");
  }

  return context;
}

export {useBurgerContext,BurgerProvider};