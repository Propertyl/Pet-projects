export const defineRootProperties = (root:HTMLElement) => {
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.position = 'relative';
  root.style.display = 'flex';
}

export function randomNumber(min:number,max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

 
