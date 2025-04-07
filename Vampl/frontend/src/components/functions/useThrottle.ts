const useThrottle = (callback:Function,delay:number) => {
  let execute:boolean = false;
  let interval:any = null;

  return () => {
    if(!interval) interval = setInterval(() => execute = !execute,delay);

    if(execute) {
      console.log('callback:',callback);
      execute = false;
      return callback();
    }
  }
}

export default useThrottle;