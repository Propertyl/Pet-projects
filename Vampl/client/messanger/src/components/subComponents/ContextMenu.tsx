import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import '../Chat/chat.css';
import { DefaultRef } from "../types/global";

const ContextMenu = ({func,pos,switchState,phrase}:{func:any,pos:{x:number,y:number},switchState:Dispatch<SetStateAction<boolean>>,phrase:string}) => {
  const contextMenuRef:DefaultRef = useRef(null);
  const offContextMenu = () => switchState(false);
  const contextUnFocus = () => {
     const menu = contextMenuRef.current;
     menu.addEventListener('animationend',animationOff);
     menu.classList.add('context-menu-reverse');
  }
  const animationOff = () => {
     const menu = contextMenuRef.current;
     offContextMenu();
     menu.removeEventListener('animationend',animationOff);
  }
  useEffect(() => {
     if(contextMenuRef.current) {
       contextMenuRef.current.focus();
     }
  },[contextMenuRef]);
   return (
     <div onMouseLeave={contextUnFocus} style={{top:pos.y - 16,left:pos.x - 16}} className="context-menu">
       <div ref={contextMenuRef} className="context-menu-container flex-center container">
         <div className="container context-menu-option flex-center error-option" onClick={() => {
           switchState(false);
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