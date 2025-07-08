import { AuthInputs, DefaultRef, SetDispatch } from "../../types/global";
import changeStrokes from "./changePhoneStrokes";
import restoreCursorPosition from "./restoreCursorPos";

const saveCursorPosition = (el:HTMLDivElement) => {
  const selection:Selection | null = window.getSelection();
  if (!selection) return null; 
  
  const range = selection.getRangeAt(0); 
  const preCaretRange = range.cloneRange(); 
  
  preCaretRange.selectNodeContents(el); 
  preCaretRange.setEnd(range.endContainer, range.endOffset); 
  const cursorPosition = preCaretRange.toString().length;
  return cursorPosition;
}

const PhoneValidation = (phoneInput:DefaultRef,inputError:AuthInputs | '',setStrokes:SetDispatch<string>,setInputError:SetDispatch<AuthInputs | ''>) => () => {
  if(phoneInput.current) {
    const cursorPosition = saveCursorPosition(phoneInput.current);
    const currentContent = phoneInput.current.innerText;
    const newStrokes = 12 - (phoneInput.current.innerText.length - 1);
    setStrokes(newStrokes);
    if(currentContent.length > 1 && inputError === 'phone') {
      setInputError('');
    }
    if(!/^[0-9+]*$/g.test(currentContent)) {
       phoneInput.current.innerText = currentContent.slice(0,-1);
       if(cursorPosition) {
          restoreCursorPosition(phoneInput.current,cursorPosition - 1);
       }
       return;
    }
    if(currentContent.length > 13) {
      phoneInput.current.innerText = currentContent.slice(0,-1);
      if(cursorPosition) {
        restoreCursorPosition(phoneInput.current,cursorPosition - 1);
      }
      phoneInput.current.blur();
      return;
    }
    changeStrokes(newStrokes,phoneInput);
  }
}

export default PhoneValidation;