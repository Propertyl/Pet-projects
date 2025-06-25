import { DefaultRef } from "../../types/global";

const changeStrokes = (currentStrokes:number,phoneInput:DefaultRef) => {
  const newSpaces = "_".repeat(currentStrokes)
  .split('').map((stroke,i,arr) => {
    if(i % Math.floor(arr.length / 3) === 0) {
      return stroke + " ";
    }
    return stroke;
  }).join('');
  phoneInput.current.setAttribute('data-left-pattern',newSpaces);
}

export default changeStrokes;

