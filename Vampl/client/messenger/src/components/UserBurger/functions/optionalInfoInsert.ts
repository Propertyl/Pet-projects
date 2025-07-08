const insertOptionalInfo = <T = string,>(condition:boolean,trueValue:T) => {
  return condition ? trueValue : undefined;
}
 
export default insertOptionalInfo;