const triggerEffect = () => {
    let bubbleExist = false;

    return (event:any) => {
        if(event.target && !bubbleExist) {
            const ripple = document.createElement('span');
            bubbleExist = true;
            const buttonRect = event.target.getBoundingClientRect();
            ripple.classList.add('ripple-btn');
            ripple.style.left = `${(event.clientX - buttonRect.left) - 16}px`;
            ripple.style.top = `${(event.clientY - buttonRect.top) - 16}px`;
            event.target.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
                bubbleExist = false;
            }, 550);
        }
    }
} 

export default triggerEffect;