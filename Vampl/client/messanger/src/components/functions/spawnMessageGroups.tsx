import { Dispatch, ReactElement, SetStateAction} from "react";
import MessageEyes from "../subComponents/messageSeen";
import parseDate from "./parseDate";
import parseMessageTime from "./parseMessageTime";
import { Dispatch as DispatchRedux } from "@reduxjs/toolkit";
import { setDeleteFunc } from "../../store/chat";

const spawnGroups = (chatData:any,userData:any,userName:string,room:string,setUnreadMessage:any,setGroups:Dispatch<SetStateAction<ReactElement[]>>,
setContextMenu:Dispatch<SetStateAction<boolean>>,
setContextMenuPos:Dispatch<SetStateAction<{x:number,y:number}>>,
dispatch:DispatchRedux
) => {

 const spawnContextMenu = (date:string,group:string,room:string,body:string,time:string) => (event:any) => {
    event.preventDefault();
    setContextMenu(true);
    setContextMenuPos({x:event.clientX,y:event.clientY});
    dispatch(setDeleteFunc({date:date,group:group,room:room,body:body,time:time}));
 }

  if(chatData) {
    const groups = [];
    for(const [index,date] of Object.entries(chatData)) {
      groups.push(
        <div className="container container-reverse group-container" key={`group-${index}`}>
          <span className="date-container">
              <p className="group-date">{parseDate(Object.keys(date as any).pop() ?? "",userData.locale,userData.allMonth)}
              </p>
          </span>
          {/* @ts-ignore */}
          {Object.values(date).pop()!.groups.map((groupData:any,groupIdx:number) => {
             const groups:any = [];
             
             for(const [groupName,group] of Object.entries(groupData) as [string,any]) {
                const isUnread = group.sender !== userName;
                const groupElem = 
                <div className={`message-group ${group.sender === userName ? 'group-right' : 'group-left'}`} key={`group-${groupIdx}`}>
                {group.messages.map((message: any, index: number) => (
                  <div onContextMenu={spawnContextMenu(
                    Object.keys(date as any).pop() ?? "",
                    groupName,room,message.body,message.time
                  )} ref={
                    isUnread && !message.seen ? setUnreadMessage(Object.keys(date as any).pop() ?? "",groupName,room,message.body) : null
                  }
                    className={`message ${index === 0 && 'rounded-message'} ${group.sender !== userName ? 'not-user-message' : ''}`} 
                    key={`message-${groupIdx}-${index}`}>
                      {index === group.messages.length - 1 && (
                        <svg viewBox="0 0 30 30" width="30" height="30" className="message-tail chat-message-tail">
                          <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31" />
                        </svg>
                      )}
                    <p className="message-body">{message.body}</p>
                    <div className="message-additional-info">
                      <p className="message-time">{parseMessageTime(message.time)}</p>
                      {group.sender === userName && <MessageEyes seen={message.seen}/>}
                    </div>
                  </div>
                ))}
              </div>
              groups.push(groupElem);
             }

             return groups;
          })}
        </div>
      );
    }

    setGroups(groups);
  }
}

export default spawnGroups;