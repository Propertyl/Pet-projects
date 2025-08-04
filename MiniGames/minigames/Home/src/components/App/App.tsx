import {Outlet} from "react-router-dom";
import './App.scss';
import { useEffect } from "react";
import playClickSound from "./functions/click-sound";;
import useGlobalStatesStore from "@/stores/globalStates";
import { getChangeUserActivity, getUserState } from "@/globals/global-selectors/user-selectors";

const playSound = playClickSound();

export const App = () => {
  const changeUserState = useGlobalStatesStore(getChangeUserActivity);
  const userState = useGlobalStatesStore(getUserState);

  useEffect(() => {
    document.addEventListener('dblclick',playSound);

    return () => {
      document.removeEventListener('dblclick',playSound); 
    };
  },[]);

  return (
      <div onClick={() => {
        if(!userState.clicked) {
          changeUserState('clicked');
        }
      }} className="root-container">
        <Outlet/>
      </div>
  );
};