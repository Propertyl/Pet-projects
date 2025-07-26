const valueProtector = <V,F>(value:V | undefined,func:F | undefined) => {

  console.log("value:",value,func);

  if(value && func) {
    return func;
  }

  return;
}
 
export default valueProtector;