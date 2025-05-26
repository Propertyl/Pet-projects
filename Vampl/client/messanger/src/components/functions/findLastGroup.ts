
const findLastGroup = (chat:Record<number,any>) => {
  console.log('chatIND:',chat);
  const indexes = Object.keys(chat);

  return indexes.reduce((acc,n) => n > acc ? n : acc,indexes[0]);
}

export default findLastGroup;