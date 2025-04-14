import { useSelector } from "react-redux";
import useFormatter from "./dateFormatter";

const dateCastling = ([day,month,year]:string[],locale:string) => {
  if(locale === 'en-US') {
    const temp = day;
    day = month;
    month = temp;
  }

  return [day,month,year];
   
}

const parseDate = (date:any,locale = 'en-US',allMonth:any) => {
  const formatter = useFormatter(locale);

  const currentDate = formatter.format(new Date()).split(/[,.\/]/);
  const [day,month,year] = dateCastling(currentDate,locale);
  const [currentDay,currentMonth,currentYear] = dateCastling(date.split(/[,.\/]/),locale);

  const clearMonth = Number(currentMonth.split('0')[1]);

  console.log('localerrrr:',clearMonth);

  if(currentYear != year) {
    return date;
  }

  const findCurrentMonth = allMonth.find((monthData:any) => monthData.numberM === clearMonth);

  return `${currentDay} ${findCurrentMonth.month}`;
}

export default parseDate;