const zeroIssue = (value:number | undefined) => {
  if(!value) return;

  if(value < 10) {
    return `0${value}`;
  }
  
  return value;
}

export default zeroIssue;