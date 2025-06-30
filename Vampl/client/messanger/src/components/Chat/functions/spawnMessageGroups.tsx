import {ReactElement, RefObject} from "react";
import MessageEyes from "./messageSeen";
import parseDate from "../../global-functions/parseDate";
import parseMessageTime from "./parseMessageTime";
import { Dispatch as DispatchRedux } from "@reduxjs/toolkit";
import { setDeleteFunc } from "../../../store/chat";
import { UserData, SetDispatch, DateGroup, ObserverProps, Message, defaultCoords, MessageJSXGroups } from "../../types/global"
import getUserPhone from "../../global-functions/getUserPhone";
import randomKey from "./randomKey";

export class ChatProcess {
  private phone:string;
  chatData:DateGroup[];
  userData:UserData;
  userName:string;
  room:string;
  setUnreadMessage:(props: ObserverProps) => (el: HTMLDivElement) => void;
  setGroups:SetDispatch<MessageJSXGroups>;
  setContextMenu:SetDispatch<boolean>;
  setContextMenuPos:SetDispatch<defaultCoords>;
  chatEndedRef:RefObject<boolean>;
  dispatch:DispatchRedux;
   constructor(
    chatData:DateGroup[],
    userData:UserData,
    userName:string,
    room:string,
    setUnreadMessage:(props: ObserverProps) => (el: HTMLDivElement) => void,
    setGroups:SetDispatch<MessageJSXGroups>,
    setContextMenu:SetDispatch<boolean>,
    setContextMenuPos:SetDispatch<defaultCoords>,
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

   spawnContextMenu = (date:string,group:string,room:string,body:string,time:string) => (event:React.MouseEvent) => {
      event.preventDefault();
      this.setContextMenu(true);
      this.setContextMenuPos({x:event.clientX,y:event.clientY});
      this.dispatch(setDeleteFunc({date:date,group:group,room:room,body:body,time:time}));
   }

  spawnGroup(
    dateGroupIndex:number,
    date: DateGroup,
  ):ReactElement {
    return (
      <div className="container container-reverse group-container" key={`group-${dateGroupIndex}-${randomKey()}`}>
                <span className="date-container">
                   <p className="group-date">{parseDate(navigator.language.split('-')[0],Object.keys(date).pop() ?? "",this.userData.allMonths)}
                   </p>
                </span>
               {Object.values(date).pop()!.groups.map((groupData:DateGroup,groupIdx:number) => {
                  const groups:ReactElement[] = [];
                  for(const [groupName,group] of Object.entries(groupData) as [string,any]) {
                     const isUnread = group.sender !== this.phone;
                     const groupElem =
                     <div className={`message-group ${group.sender === this.phone ? 'group-right' : 'group-left'}`} key={`group-${groupIdx}`}>
                     {group.messages.map((message:Message, index: number) => (
                       <div onContextMenu={this.spawnContextMenu(
                          Object.keys(date as DateGroup).pop() ?? "",
                          groupName,this.room,message.body,message.time
                          )} ref={
                                isUnread && !message.seen ? this.setUnreadMessage({
                                  date:Object.keys(date as DateGroup).pop() ?? "",
                                  group:groupName,
                                  room:this.room,
                                  body:message.body,
                                  time:message.time
                                }) : null
                              }   
                        style={{transition:`all ${Math.max(dateGroupIndex * .15,.15)}s ease-out`}}
                        className={`message ${index === 0 ? 'rounded-message' : ''} ${group.sender !== this.phone ? 'not-user-message' : ''}`}
                         key={`message-${groupIdx}-${index}`}>
                           {index === group.messages.length - 1 && (
                             <svg viewBox="0 0 30 30"  className="message-tail chat-message-tail">
                               <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31" />
                             </svg>
                           )}
                         <p className="message-body">{message.body}</p>
                          <div className="message-additional-info">
                           <p className="message-time">{parseMessageTime(navigator.language.split('-')[0],message.time)}</p>
                           {
                            group.sender === this.phone && <MessageEyes seen={message.seen}/>
                           }
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
    this.phone = await getUserPhone(this.dispatch);
 }

 spawnGroups() {
    const dateGroups = Object.entries(this.chatData);
    
    let end = dateGroups.length;
    let start = Math.max(0,dateGroups.length - 2);

    return () => {
      const currentSlice = dateGroups.slice(start,end).reverse();

      this.setGroups((elemGroups:MessageJSXGroups) => {
        const newGroups = [...elemGroups];
        let i = 0;
        for(const [_,date] of currentSlice) {
          const [dateKey] = Object.keys(date);
          const group:Record<string,ReactElement> = {[dateKey]:this.spawnGroup(i,date)};
          i++;
          newGroups.unshift(group);
        }

        return newGroups;
      });

      start = Math.max(0,start - 2);
      end = Math.max(0,end - 2);

      if(start === 0 && end === 0) {
        this.chatEndedRef.current = true;
      } else if(this.chatEndedRef.current) {
        this.chatEndedRef.current = false;
      }  
    }
  }
}