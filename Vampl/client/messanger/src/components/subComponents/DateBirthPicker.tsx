import { useSelector } from "react-redux";
import { Store } from "../types/global";
import { useState } from "react";
import { DateValues, SetDispatch } from "../types/global";
import { useBurgerContext } from "../context/BurgerContext";
import zeroIssue from "../global-functions/zeroIssue";

type ValueList<T> = {
  valueList:T[],
  field:string 
}

const createDaysList = () => {
  return Array.from({length:31},(_,i) => 1 + i);
}

const createYearsList = () => {
  return Array.from({length:76},(_,i) => 2025 - i);
}

const switchList = (setList:SetDispatch<string>,type:string) => {
  setList((value:string) => value === type ? '' : type);
}

const parseMonths = (months:{id:number,month:string}[]) => {
  const lang = navigator.language;
    return months.map(({ id, month }) => {
    const newMonth = ['ru','uk'].includes(lang) ? month.charAt(0).toUpperCase() + month.slice(1) : month;

    return [id, newMonth];
  });
}

const ValueSelector = <T,>({valueList,field}:ValueList<T>) => {
  const {setUserBirthDate} = useBurgerContext();
  const isMonthList = field === 'month';

  return (
    <div className="date-value-list flex-center">
        <div className="container flex-reverse values-container">
            {valueList.map((value,ind) => (
              <div className="date-value" onClick={() => {
                const optionValue = Number(isMonthList ? value[0 as keyof T] : value);
                if(setUserBirthDate) {
                  setUserBirthDate((prevData:DateValues | null) => {
                      if(prevData) {
                        return {...prevData,[field]:optionValue};
                      }
                
                      return {[field as keyof DateValues]:optionValue};
                  });
                }
              }} key={`value-for-pick-${ind}`}>{String(isMonthList ? value[1 as keyof T] : value)}</div>
            ))}
          </div>
    </div>
  )
}


const DateOfBirthBlock = ({labelText}:{labelText:string | undefined}) => {
  const months = useSelector((store:Store) => store.user.allMonths);
  const [openedList,setOpenedList] = useState<string>('');
  const parsedMonths = parseMonths(months);
  const {userBirthDate} = useBurgerContext();

  return (
      <div className="date-pick-container container flex-center">
        <div className="date-pick" data-label-text={labelText}>
          <span onClick={() => switchList(setOpenedList,'days')} className={`date-block ${openedList === 'days' ? 'block-active' : ''} flex-center`}>
            {zeroIssue(userBirthDate?.day)}
            { openedList === 'days' &&<ValueSelector valueList={createDaysList()} field="day"/> }
          </span>
          <span onClick={() => switchList(setOpenedList,'months')} className={`date-block ${openedList === 'months' ? 'block-active' : ''} flex-center`}>
            {zeroIssue(userBirthDate?.month)}
            { openedList === 'months' && <ValueSelector valueList={parsedMonths} field="month"/> }
          </span>
          <span onClick={() => switchList(setOpenedList,'years')} className={`date-block ${openedList === 'years' ? 'block-active' : ''} flex-center`}>
            {userBirthDate?.year}
            { openedList === 'years' && <ValueSelector valueList={createYearsList()} field="year"/> }
          </span>
        </div>
      </div>
  )
}

export default DateOfBirthBlock;