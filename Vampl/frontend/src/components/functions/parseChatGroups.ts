const parseToDeleteGroup = (chat:any) => {
  for(let date of Object.keys(chat)) {
    const {groups} = chat[date ?? ""];
    if(groups) {
      const clearedGroups = [];
      for(let i = 0; i < groups.length; i++) {
        clearedGroups.push(Object.values(groups[i])[0]);
      }

      chat[date as any].groups = clearedGroups;
    }
  }

  return chat;
}

export default parseToDeleteGroup