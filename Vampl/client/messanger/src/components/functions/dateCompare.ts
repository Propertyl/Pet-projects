import { dateCastling } from "./parseDate";

const datePastCompare = (current:string,previous:string) => {
  const currentArr:number[] = dateCastling(current).map(Number);
  const pArr:number[] = dateCastling(previous)
  .map(Number);

  for (let i = currentArr.length - 1; i > 0; i--) {
    if (currentArr[i] > pArr[i]) return true;
    if (currentArr[i] < pArr[i]) return false;
  }

  return false; 
}

export default datePastCompare;