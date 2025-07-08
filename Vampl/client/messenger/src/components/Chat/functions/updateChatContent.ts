import { RefObject } from "react";
import { RefFunc } from "../../types/global";

const updateChatContent = (chat:HTMLDivElement,groupsSpawner:RefObject<RefFunc<[]>>,cantUpdateRef:RefObject<boolean>) => {
  if(groupsSpawner.current) {
    const beforePos = chat.scrollHeight - chat.scrollTop;
    groupsSpawner.current();
    setTimeout(() => {
      chat.scrollTo({top:chat.scrollHeight - beforePos,behavior: "instant"});
      cantUpdateRef.current = false;
    },10);
  }
}

export default updateChatContent;