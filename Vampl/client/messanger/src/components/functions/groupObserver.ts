import { Socket } from "socket.io-client";

const setObserver = (elems:any,options:IntersectionObserverInit,socket:Socket) => {

  console.log('start connecting observers:',elems);
  const observer = new IntersectionObserver((entries,_) => {
     entries.forEach(entry => {
       if(entry.isIntersecting) {
         const group = entry.target.getAttribute('data-group-name');
          socket.emit('messages-watch',group);
       }
     });
  },options);

  elems.forEach((elem:any) => observer.observe(elem));
}

export default setObserver;