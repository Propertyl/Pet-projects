const updateGroupView = (chat:any,date:string,group:string,body:string) => {
   const all = chat['all'];
    for(let i:number = 0; i < all.length; i++) {
        const [thisDate] = Object.keys(all[i]);
        
        if(thisDate === date) {
          const currentGroupInd = all[i][thisDate].groups.findIndex((grp:any) => {
             const [groupName] = Object.keys(grp);
             
             return groupName === group;
          });

          const messages = all[i][thisDate].groups[currentGroupInd][group].messages;

          console.log('date:',thisDate,'group:',group,'body:',body,'messages:',messages);

          const messageInd = messages.findIndex((message:any) => message.body === body);

          messages[messageInd].seen = true;
        }
    }

    return chat;
}

export default updateGroupView;