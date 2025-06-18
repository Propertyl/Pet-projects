const parseToDeleteGroup = (chat:any) => {
  const newChat = {...chat};
  for(let i = 0; i < newChat.length; i++) {
    const currentDate = Object.keys(newChat[i]).pop() ?? "";
    const {groups} = newChat[i][currentDate];
    console.log('currentDate:',currentDate,'groups:',groups);
    if(groups) {
      const clearedGroups = [];
      for(let i = 0; i < groups.length; i++) {
        const groupName = Object.keys(groups[i]).pop() ?? "";
        clearedGroups.push({name:groupName,body:Object.values(groups[i])[0]});
      }

      newChat[i][currentDate].groups = clearedGroups;
    }
  }

  return {...newChat};
}

export default parseToDeleteGroup;