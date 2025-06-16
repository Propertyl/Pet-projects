import useFormatter from "./dateFormatter";
import { dateCastling } from "./parseDate";

const parseBirthD = (date:string,months:{id:number,numberM:number,month:string}[]) => {
  console.log('m:',months);
  const formatter = useFormatter();
  const currentDate = formatter.format(new Date());
  const [currentDay,currentMonth,currentYear] = dateCastling(currentDate).map(Number);
  const [userDay,userMonth,userYear] = date.split('/').map(Number);
  const monthTranslate = months.find(({id}) => id === userMonth);
  let age = currentYear - userYear;
  if(currentMonth < userMonth || (currentMonth === userMonth && currentDay < userDay)) {
    age -= 1;
  } 

  return `${userDay} ${monthTranslate?.month} (${age} y.o)`;
}

export default parseBirthD;