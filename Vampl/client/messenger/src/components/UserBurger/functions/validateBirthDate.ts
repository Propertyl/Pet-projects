import { DateValues } from "../../types/global";

const validateBirthDate = (date:DateValues) => {
  const allValues = Object.values(date).every(value => value > 0);
  console.log('keys:',Object.keys(date).length,'value:',allValues);
  if(Object.keys(date).length < 3 || !allValues) {
    return false;
  }

  return true;
}

export default validateBirthDate;