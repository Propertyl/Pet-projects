import { DefaultRef } from "../types/global";

const inBounds = (currentValue:number,start:number,end:number) => currentValue >= start && currentValue <= end;

const touchOutOfMenu = (contextRef:DefaultRef,unFocus:() => void) => (event:TouchEvent) => {
  if(!event.touches.length) return;
  const touch = event.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;
  const menu = contextRef.current.getBoundingClientRect();
  if(!inBounds(touchX,menu.left,menu.right) || !inBounds(touchY,menu.top,menu.bottom)) {
    unFocus();
  }
}

export default touchOutOfMenu;