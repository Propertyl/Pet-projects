const useThrottle = (callback:Function,delay:number) => {
  let execute:boolean = false;
  let interval:any = null;

  return (event:Event) => {
    if(!interval) interval = setInterval(() => execute = !execute,delay);

    if(execute) {
      execute = false;
      return callback(event);
    }
  }
}

export default useThrottle;