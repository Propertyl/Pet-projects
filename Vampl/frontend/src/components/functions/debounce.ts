const useDebounce = (func:any,delay:number) => {
  let timer:any = null;

  return function() {
    if(timer) {
      clearTimeout
    }

    timer = setTimeout(func,delay);
  }

}

export default useDebounce;