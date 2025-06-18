import { RefObject } from "react";

const updateChatContent = (chat:HTMLDivElement,groupsSpawner:RefObject<any>,cantUpdateRef:RefObject<boolean>) => {
    const beforePos = chat.scrollHeight - chat.scrollTop;

    groupsSpawner.current();
    setTimeout(() => {
      chat.scrollTo({top:chat.scrollHeight - beforePos,behavior: "instant"});
      cantUpdateRef.current = false;
    },10);
}

export default updateChatContent;