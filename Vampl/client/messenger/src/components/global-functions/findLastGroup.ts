import { ChatStructure } from "../types/global";

const findLastGroup = (chat:Record<number,ChatStructure>) => {
  const indexes = Object.keys(chat);

  return indexes.reduce((acc,n) => n > acc ? n : acc,indexes[0]);
}

export default findLastGroup;