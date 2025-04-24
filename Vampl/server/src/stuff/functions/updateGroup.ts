const updateGroupView = (chat:any,date:string,group:string,body:string) => {
   const all = chat['all'];
    for(let i:number = 0; i < all.length; i++) {
      const dateGroup = all[i];
      const [thisDate] = Object.keys(dateGroup);
        
        if(thisDate === date) {
          const currentGroupInd = dateGroup[thisDate].groups.findIndex((grp:any) => {
             const [groupName] = Object.keys(grp);
             
             return groupName === group;
          });

          const currentGroup = dateGroup[thisDate].groups[currentGroupInd];

          const messages = currentGroup[group].messages;

          const messageInd = messages.findIndex((message:any) => message.body === body && message.seen === false);
          
          if(messageInd >= 0) {
            console.log('we intersted by:',messages[messageInd],messageInd,messages);

            messages[messageInd].seen = true;
          }
        }
    }

    return chat;
}

export default updateGroupView;