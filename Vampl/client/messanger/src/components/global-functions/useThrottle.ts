const useThrottle = (callback:Function,delay:number) => {
  let execute:boolean = false;
  let interval:any = null;

  return (event:Event) => {
    if(!interval) interval = setInterval(() => execute = !execute,delay);

    console.log('try it:',execute,interval);

    if(execute) {
      execute = false;
      console.log('active')
      return callback(event);
    }
  }
}

export default useThrottle;