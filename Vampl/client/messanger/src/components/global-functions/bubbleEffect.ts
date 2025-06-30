const takeMain = (isNecessary:boolean,elem:HTMLDivElement):HTMLElement => {
    if(isNecessary) return elem.parentElement || elem;

    return elem;
};

const triggerEffect = () => {
    let bubbleExist = false;

    return (event:React.MouseEvent,parentNecessary:boolean) => {
        const target = takeMain(parentNecessary,event.target as HTMLDivElement);
        if(target && !bubbleExist) {
            const ripple = document.createElement('span');
            bubbleExist = true;
            const buttonRect = target.getBoundingClientRect();
            ripple.classList.add('ripple-btn');
            ripple.style.left = `${(event.clientX - buttonRect.left) - 16}px`;
            ripple.style.top = `${(event.clientY - buttonRect.top) - 16}px`;
            target.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
                bubbleExist = false;
            }, 550);
        }
    }
} 

export default triggerEffect;