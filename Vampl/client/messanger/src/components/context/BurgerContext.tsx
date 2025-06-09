import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { BurgerInfo } from "../types/global";

type BurgerContextType = {burgerInfo:BurgerInfo | null,setBurgerInfo:Dispatch<SetStateAction<BurgerInfo | null>>};

const BurgerContext = createContext<BurgerContextType | undefined>(undefined);

const BurgerProvider = ({children}:{children:ReactNode}) => {
  const [burgerInfo,setBurgerInfo] = useState<BurgerInfo | null>(null);
  return (
    <BurgerContext.Provider value={{burgerInfo,setBurgerInfo}}>
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