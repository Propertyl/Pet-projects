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

const parseDate = (date:any,locale = 'en-US',allMonth:any) => {

  const formatter = useFormatter(locale);

  const currentDate = formatter.format(new Date());
  const [__,_,year] = dateCastling(currentDate);
  const [currentDay,currentMonth,currentYear] = dateCastling(date);

  const clearMonth = Number(currentMonth.split('0')[1]);

  console.log('localerrrr:',year,currentDay,currentMonth,currentYear);

  if(currentYear != year) {
    return date;
  }

  const findCurrentMonth = allMonth.find((monthData:any) => monthData.numberM === clearMonth);

  return `${currentDay} ${findCurrentMonth.month}`;
}

export default parseDate;