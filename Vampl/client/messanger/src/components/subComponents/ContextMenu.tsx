import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import '../Chat/chat.css';
import { defaultCoords, DefaultRef } from "../types/global";
import touchOutOfMenu from "../global-functions/touchOutOfMenu";

const makeOutOfBounds = (extremePoint:number,windowBound:number,menuCoord:number) => {
  if(extremePoint > windowBound) {
    menuCoord -= (extremePoint - windowBound);
  }

  return menuCoord;
}

const controlOutOfBoundsSpawn = (pos:defaultCoords,menu:DefaultRef):defaultCoords => {
  const newPos = {...pos};
  const rect = menu.current.getBoundingClientRect();

  console.log('before:',newPos);

  newPos.x = makeOutOfBounds(rect.right,window.innerWidth,newPos.x);
  newPos.y = makeOutOfBounds(rect.bottom,window.innerHeight,newPos.y);

  console.log('after all:',newPos);

  return newPos;
}

const ContextMenu = ({func,pos,switchState,phrase}:{func:any,pos:{x:number,y:number},switchState:Dispatch<SetStateAction<boolean>>,phrase:string}) => {
  const [fixatedPos,setFixatedPos] = useState<defaultCoords>({x:pos.x,y:pos.y});
  const contextMenuRef:DefaultRef = useRef(null);
  const offContextMenu = () => switchState(false);
  const contextUnFocus = () => {
     const menu = contextMenuRef.current;
     menu.addEventListener('animationend',animationOff);
     menu.classList.add('context-menu-reverse');
  }

  const checkTouch = touchOutOfMenu(contextMenuRef,contextUnFocus);

  const animationOff = () => {
     const menu = contextMenuRef.current;
     offContextMenu();
     menu.removeEventListener('animationend',animationOff);
  }

  useEffect(() => {
     if(contextMenuRef.current) {
       contextMenuRef.current.focus();
       setFixatedPos(fixated => controlOutOfBoundsSpawn(fixated,contextMenuRef));
       if(window.innerWidth < 1100) {
          document.addEventListener('touchstart',checkTouch);

          return () => {
            document.removeEventListener('touchstart',checkTouch);
          }
       }
     }
  },[contextMenuRef]);

  useEffect(() => {
    const rootElem = document.documentElement;
    rootElem.classList.add('hidden');

    return () => {
      rootElem.classList.remove('hidden');
    }
  },[]);

   return (
     <div onMouseLeave={contextUnFocus} style={{top:fixatedPos.y - 16,left:fixatedPos.x - 16}} className="context-menu">
       <div ref={contextMenuRef} className="context-menu-container flex-center container">
         <div className="container context-menu-option flex-center error-option" onClick={() => {
           contextUnFocus();
           func()();
         }}>
           <p className="delete-text">{phrase}</p>
           <svg className="random-icon context-menu-icon" width="64px" height="64px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ff6666"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20L18.4199 20.2209C18.3074 21.2337 17.4512 22 16.4321 22H7.56786C6.54876 22 5.69264 21.2337 5.5801 20.2209L4 6Z" stroke="#ff7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M7.34491 3.14716C7.67506 2.44685 8.37973 2 9.15396 2H14.846C15.6203 2 16.3249 2.44685 16.6551 3.14716L18 6H6L7.34491 3.14716Z" stroke="#ff7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 6H22" stroke="#ff7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10 11V16" stroke="#ff7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14 11V16" stroke="#ff7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
         </div>
       </div>
     </div>
   )
}

export default ContextMenu;