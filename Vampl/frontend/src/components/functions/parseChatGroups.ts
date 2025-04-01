const parseToDeleteGroup = (chat:any) => {
  for(let i = 0; i < chat.length; i++) {
    const currentDate = Object.keys(chat[i]).pop() ?? "";
    const {groups} = chat[i][currentDate];
    console.log('currentDate:',currentDate,'groups:',groups);
    if(groups) {
      const clearedGroups = [];
      for(let i = 0; i < groups.length; i++) {
        const groupName = Object.keys(groups[i]).pop() ?? "";
        clearedGroups.push({name:groupName,body:Object.values(groups[i])[0]});
      }

      chat[i][currentDate].groups = clearedGroups;
    }
  }

  return {...chat};
}

export default parseToDeleteGroup;