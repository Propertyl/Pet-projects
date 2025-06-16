import { ObserverProps } from "../types/global";

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

  return (elem:HTMLDivElement,props:ObserverProps) => {
    Groups.set(elem,props);
    observer.observe(elem);
  }

}

export default useObserver;