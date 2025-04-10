const setObserver = (elems:any,options:IntersectionObserverInit) => {

  console.log('start connecting observers:',elems);
  const observer = new IntersectionObserver((entries,_) => {
     entries.forEach(entry => {
       if(entry.isIntersecting) {
        console.log('see that group');
       }
     });
  },options);

  elems.forEach((elem:any) => observer.observe(elem));
}

export default setObserver;