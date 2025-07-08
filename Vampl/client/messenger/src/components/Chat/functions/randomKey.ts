import genNumber from "../../global-functions/randomNumber";

const randomKey = () => {
  return Array.from({length:genNumber(3,6)},(_) => genNumber(0,9)).join('');
}

export default randomKey;