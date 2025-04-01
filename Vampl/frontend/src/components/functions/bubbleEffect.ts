const triggerEffect = (event:any) => {
    if(event.target && event.target) {
    const ripple = document.createElement('span');
    const buttonRect = event.target.getBoundingClientRect();
    ripple.classList.add('ripple-btn');
    ripple.style.left = `${(event.clientX - buttonRect.left) - 16}px`;
    ripple.style.top = `${(event.clientY - buttonRect.top) - 16}px`;
    event.target.appendChild(ripple);

    setTimeout(() => ripple.remove(), 550);
   }
}; 

export default triggerEffect;