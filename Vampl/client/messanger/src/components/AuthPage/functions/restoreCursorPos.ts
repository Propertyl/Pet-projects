const restoreCursorPosition = (el:any, cursorPosition:any) => {
  const selection:Selection | null = window.getSelection();
  if(!selection) return;
  selection.removeAllRanges(); 
  
  const range:Range = document.createRange();
  let charCount:number = 0;
  
  const findPosition = (node:Node):boolean => {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharCount:number = charCount + (node.textContent?.length || 0);
      
      if (cursorPosition <= nextCharCount) {
        range.setStart(node, cursorPosition - charCount);
        range.setEnd(node, cursorPosition - charCount);
        return true;
      }
      
      charCount = nextCharCount;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (findPosition(node.childNodes[i])) return true;
      }
    }
    return false;
  };

  findPosition(el);
  selection.addRange(range); 
}

export default restoreCursorPosition;