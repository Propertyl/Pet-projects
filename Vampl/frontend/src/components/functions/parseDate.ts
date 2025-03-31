import useUserData from "../../store/userData";

const parseDate = (date:any) => {
  const allMonth = useUserData().allMonth;
  const [day,month,global] = new Date().toLocaleString().split('.');
  const [currentDay,currentMonth,currentYear] = date.split('.');
  const [year,_] = global.split(',');

  const clearMonth = Number(currentMonth.split('0')[1]);

  if(currentYear != year) {
    return date;
  }

  const findCurrentMonth = allMonth.find((monthData:any) => monthData.numberM === clearMonth);

  return `${currentDay} ${findCurrentMonth.month}`;
}

export default parseDate;