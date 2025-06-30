const useThrottle = (callback:Function,delay:number) => {
  let execute:boolean = false;
  let interval:NodeJS.Timer | null = null;

  return (event?:Event) => {
    if(!interval) interval = setInterval(() => execute = !execute,delay);

    if(execute) {
      execute = false;
      console.log('active')
      return callback(event);
    }
  }
}

export default useThrottle;