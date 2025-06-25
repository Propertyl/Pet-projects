import { Dispatch } from "@reduxjs/toolkit";
import { ObserverProps } from "../../types/global";
import { decrementMessages } from "../../../store/chat";
import { Socket } from "socket.io-client";

const useObserver = (options:IntersectionObserverInit,socket:Socket,dispatch:Dispatch) => {
  const Groups:Map<Element,{room:string,date:string,group:string,body:string}> = new Map();
  const observer = new IntersectionObserver((entries,_) => {
     entries.forEach(entry => {
       if(entry.isIntersecting) {
         const elem = Groups.get(entry.target);
         if(elem) {
          socket.emit('messages-watch',elem);
          observer.unobserve(entry.target);
          dispatch(decrementMessages(elem.room));
         }
       }
     });
  },options);

  return (elem:HTMLDivElement,props:ObserverProps) => {
    Groups.set(elem,props);
    observer.observe(elem);
  }

}

export default useObserver;