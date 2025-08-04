import { _2dCoords_ } from "@/types/valueTypes";

const ContextMenuPositionFixer = (menuRect:DOMRect,pos:_2dCoords_) => {

  const {right,bottom} = menuRect;
  const {innerWidth:windowWidth,innerHeight:windowHeight} = window;

  const newPos = {...pos};
  
  if(right > windowWidth) {
    const diff = (right - windowWidth) * 2;
    newPos.x -= diff;
  }

  if(bottom > windowHeight) {
    newPos.y -= bottom - windowHeight;
  }

  return newPos;
}
 
export default ContextMenuPositionFixer;