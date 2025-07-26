import {Outlet} from "react-router-dom";
import './App.scss';
import { useEffect, useRef, useState } from "react";
import playClickSound from "./functions/click-sound";
import { selectionPoints } from "@/types/valueTypes";
import { UserSelection } from "./functions/window-selection";
import useGlobalStatesStore from "@/stores/globalStates";
import { clearActiveIcons, getChangeUserActivity, getDragAnswer, getUserState, setActiveSelection } from "@/globals/global-selectors/user-selectors";

const playSound = playClickSound();

export const App = () => {
  const [spawnSelection, setSpawnSelection] = useState<boolean>(false);
  const changeUserState = useGlobalStatesStore(getChangeUserActivity);
  const somethingIsDrag = useGlobalStatesStore(getDragAnswer);
  const setActivatedSelection = useGlobalStatesStore(setActiveSelection);
  const setClearActiveIcons = useGlobalStatesStore(clearActiveIcons);
  const userState = useGlobalStatesStore(getUserState);
  const [{startPoint,endPoint},setPoints] = useState<selectionPoints>({
    startPoint:{x:0,y:0},
    endPoint:{x:0,y:0}
  });
  const userSelectionRef = useRef<UserSelection | null>(null);

  useEffect(() => {
    if(!userSelectionRef.current) {
      userSelectionRef.current = new UserSelection(
        setSpawnSelection,
        setPoints,
        changeUserState,
        setActivatedSelection,
        setClearActiveIcons
      );
    }
  },[]);

  useEffect(() => {
    const userSelection = userSelectionRef.current;

    document.addEventListener('dblclick',playSound);
    if(userSelectionRef.current) {
      document.addEventListener('mousedown',userSelection.startSelection);
      document.addEventListener('mouseup',userSelection.endSelection);
    }

    return () => {
      document.removeEventListener('dblclick',playSound);
      if(userSelectionRef.current) {
        document.removeEventListener('mousedown',userSelection.startSelection);
        document.addEventListener('mouseup',userSelection.endSelection);
      } 
    };

  },[userSelectionRef,somethingIsDrag]);

  useEffect(() => {
    if(somethingIsDrag) {
      userSelectionRef.current.endSelection();
    }
  },[somethingIsDrag]);

  useEffect(() => {
    const userSelection = userSelectionRef.current;

    if(spawnSelection) {
      document.addEventListener('mousemove',userSelection.moveSelection);
    } else {
      document.removeEventListener('mousemove',userSelection.moveSelection);
    }

  },[spawnSelection]);

  return (
      <div onClick={() => {
        if(!userState.clicked) {
          changeUserState('clicked');
        }
      }} className="root-container">
        { spawnSelection && 
          <div style={{
            top:startPoint.y,
            left:startPoint.x,
            width:userSelectionRef.current.calculateSize(startPoint.x,endPoint.x),
            height:userSelectionRef.current.calculateSize(startPoint.y,endPoint.y),
          }} className="user-selection"></div>
        }
          <Outlet/>
      </div>
  );
};