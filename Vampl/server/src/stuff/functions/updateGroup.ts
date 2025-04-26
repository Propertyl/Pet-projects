import { Chat, DateGroup, Message } from "../types";

const updateGroup = (chat:Chat,date:string,group:string,body:string,time:string = '',type:'view' | 'delete') => {
    let all = chat['all'];
    const condition = (message:Message) => {
       if(type === 'view') {
          return message.body === body && message.seen === false;
       }

       return message.body === body && message.time === time;
    }

    const currentDate = all.find(dateGroup => {
        const [groupDate] = Object.keys(dateGroup);

        return groupDate === date;
    });

    if(currentDate) {
      const currentGroupInd = currentDate[date].groups.findIndex((grp:any) => {
         const [groupName] = Object.keys(grp);
         
         return groupName === group;
      });
      const currentGroup = currentDate[date].groups[currentGroupInd];
      const messages = currentGroup[group].messages;
      const messageInd = messages.findIndex(condition);
      
      if(messageInd >= 0) {
        if(type === 'view') {
          messages[messageInd].seen = true;
        } else {
          messages.splice(messageInd,1);
          if(!messages.length) {
             currentDate[date].groups.splice(currentGroupInd,1);
             if(!currentDate[date].groups.length) {
                chat['all'] = all.filter(dateGroup => {
                  const [groupDate] = Object.keys(dateGroup);
                
                  return groupDate !== date;
               });
             }
          }
        }
      }
    }

    return chat;
}

export default updateGroup;

// const dateGroup = all[i];
// const [thisDate] = Object.keys(dateGroup);
  
//   if(thisDate === date) {
//     const currentGroupInd = dateGroup[thisDate].groups.findIndex((grp:any) => {
//        const [groupName] = Object.keys(grp);
       
//        return groupName === group;
//     });

//     const currentGroup = dateGroup[thisDate].groups[currentGroupInd];

//     console.log('currentGroup:',currentGroup,
//       'dateGroup:',dateGroup,
//       'thisDate:',thisDate,
//       'group:',group,
//       'date:',date
//     );

//     const messages = currentGroup[group].messages;

//     const messageInd = messages.findIndex(condition);
    
//     if(messageInd >= 0) {
//       if(type === 'view') {
//         messages[messageInd].seen = true;
//       } else {
//         messages.splice(messageInd,1);
//       }
//     }
//   }