import useFormatter from "./dateFormatter";

const dateCastling = (date:string) => {
  let [day,month,year] = date.split(/[.,\/]/);
  if(date.includes('\/')) {
    const temp = day;
    day = month;
    month = temp;
  }

  return [day,month,year];
}

const parseDate = (date:string,locale = 'en-US',allMonth:any) => {

  const formatter = useFormatter(locale);

  const currentDate = formatter.format(new Date());
  const [day,_,year] = dateCastling(currentDate);
  const [currentDay,currentMonth,currentYear] = dateCastling(date);

  const clearMonth = Number(currentMonth.split('0')[1]);

  if(currentYear != year) {
    return date;
  }

  if(currentDay === day) {
    return "Today";
  }
  

  const findCurrentMonth = allMonth.find((monthData:any) => monthData.numberM === clearMonth);

  return `${currentDay} ${findCurrentMonth.month}`;
}

export default parseDate;