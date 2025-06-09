import React, { Dispatch,ReactElement, RefObject, SetStateAction} from "react";
import MessageEyes from "../subComponents/messageSeen";
import parseDate from "./parseDate";
import parseMessageTime from "./parseMessageTime";
import { Dispatch as DispatchRedux } from "@reduxjs/toolkit";
import { setDeleteFunc } from "../../store/chat";
import { UserData,ChatStructure } from "../types/global"
import { userApi } from "../../store/api/baseApi";

export class ChatProcess {
  private phone:string;
  chatData:ChatStructure
  userData:UserData
  userName:string
  room:string
  setUnreadMessage:(...args:any) => any
  setGroups:Dispatch<SetStateAction<ReactElement[]>>
  setContextMenu:Dispatch<SetStateAction<boolean>>
  setContextMenuPos:Dispatch<SetStateAction<{x:number,y:number}>>
  chatEndedRef:RefObject<boolean>
  dispatch:DispatchRedux;
   constructor(
    chatData:ChatStructure,
    userData:UserData,
    userName:string,
    room:string,
    setUnreadMessage:any,setGroups:Dispatch<SetStateAction<ReactElement[]>>,
    setContextMenu:Dispatch<SetStateAction<boolean>>,
    setContextMenuPos:Dispatch<SetStateAction<{x:number,y:number}>>,
    chatEndedRef:RefObject<boolean>,
    dispatch:DispatchRedux
   ) {
     this.chatData = chatData;
     this.userData = userData;
     this.userName = userName;
     this.room = room;
     this.setUnreadMessage = setUnreadMessage;
     this.setGroups = setGroups;
     this.setContextMenu = setContextMenu;
     this.setContextMenuPos = setContextMenuPos;
     this.chatEndedRef = chatEndedRef;
     this.dispatch = dispatch;
     this.phone = '';
   }


   spawnContextMenu = (date:string,group:string,room:string,body:string,time:string) => (event:any) => {
      event.preventDefault();
      this.setContextMenu(true);
      this.setContextMenuPos({x:event.clientX,y:event.clientY});
      this.dispatch(setDeleteFunc({date:date,group:group,room:room,body:body,time:time}));
   }

  spawnGroup = (
    index:any,
    date: any,
  ):ReactElement => {
    console.log('dute:',date);
  return (
    <div className="container container-reverse group-container" key={`group-${index}`}>
             <span className="date-container">
                 <p className="group-date">{parseDate(Object.keys(date as any).pop() ?? "",this.userData.allMonth)}
                 </p>
             </span>
             {/* @ts-ignore */}
             {Object.values(date).pop()!.groups.map((groupData:any,groupIdx:number,arr:any) => {
                const groups:any = [];
                for(const [groupName,group] of Object.entries(groupData) as [string,any]) {
                   const isUnread = group.sender !== this.phone;
                   const groupElem =
                   <div className={`message-group ${group.sender === this.phone ? 'group-right' : 'group-left'}`} key={`group-${groupIdx}`}>
                   {group.messages.map((message: any, index: number) => (
                     <div onContextMenu={this.spawnContextMenu(
                       Object.keys(date as any).pop() ?? "",
                       groupName,this.room,message.body,message.time
                      )} ref={
                        isUnread && !message.seen ? this.setUnreadMessage(Object.keys(date as any).pop() ?? "",groupName,this.room,message.body) : null
                      }
                      style={{transition:`opacity ${(arr.length - groupIdx) * .15}s ease-out`}}
                      className={`message ${index === 0 ? 'rounded-message' : ''} ${group.sender !== this.phone ? 'not-user-message' : ''}`}
                       key={`message-${groupIdx}-${index}`}>
                         {index === group.messages.length - 1 && (
                           <svg viewBox="0 0 30 30" width="30" height="30" className="message-tail chat-message-tail">
                             <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31" />
                           </svg>
                         )}
                       <p className="message-body">{message.body}</p>
                       <div className="message-additional-info">
                         <p className="message-time">{parseMessageTime(message.time)}</p>
                         {group.sender === this.phone && <MessageEyes seen={message.seen}/>}
                       </div>
                     </div>
                   ))}
                 </div>
                 groups.push(groupElem);
                }
                return groups;
             })}
           </div>
    )
  }

 async getUserPhone() {
    const {phone}:UserData = await this.dispatch(userApi.endpoints.getUserConvenientData.initiate({url:'info'})).unwrap() as UserData;

    this.phone = phone;
    return;
 }

 spawnGroups() {
    const currentGroups:Set<any> = new Set();
    const dateGroups = Object.entries(this.chatData);
    
    let end = dateGroups.length;
    let start = Math.max(0,dateGroups.length - 2);

    return () => {
      const groups:any[] = [];
      const currentSlice = dateGroups.slice(start,end);
      console.log('start spawn:',start,end);
      for(const [index,date] of currentSlice) {
        groups.push(
          this.spawnGroup(index,date)
        );
        currentGroups.add(groups);
      }

      start = Math.max(0,start - 2);
      end = Math.max(0,end - 2);
      const elems = Array.from(currentGroups).reverse();
      this.setGroups(elems);

      if(start === 0 && end === 0) {
        this.chatEndedRef.current = true;
      } else {
        this.chatEndedRef.current = false;
      }

    }
  }
}