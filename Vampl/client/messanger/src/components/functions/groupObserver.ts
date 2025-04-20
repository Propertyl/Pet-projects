const useObserver = (options:IntersectionObserverInit,socket:any) => {

  const currentObserve = new Set<HTMLDivElement>();

  const observer = new IntersectionObserver((entries,_) => {
     entries.forEach(entry => {
       if(entry.isIntersecting) {
         const group = entry.target.getAttribute('data-group-name');
         socket.emit('messages-watch',group);
       }
     });
  },options);

  return (elems:HTMLDivElement[]) => {
    console.log('start connecting observers:',elems);
    elems.forEach((elem:any) => {
       if(!currentObserve.has(elem)) {
          observer.observe(elem);
          currentObserve.add(elem);
       }
    });
  }

}

export default useObserver;