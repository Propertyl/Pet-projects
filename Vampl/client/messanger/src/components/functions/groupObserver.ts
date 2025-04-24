const useObserver = (options:IntersectionObserverInit,socket:any) => {
  const Groups:Map<Element,{room:string,date:string,group:string,body:string}> = new Map();
  const observer = new IntersectionObserver((entries,_) => {
     entries.forEach(entry => {
       if(entry.isIntersecting) {
         socket.emit('messages-watch',Groups.get(entry.target));
         observer.unobserve(entry.target);
       }
     });
  },options);

  return (elem:HTMLDivElement,date:string,group:string,room:string,body:string) => {
    Groups.set(elem,{room,date,group,body});
    observer.observe(elem);
  }

}

export default useObserver;