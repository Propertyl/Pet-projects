import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { DefaultRef } from "../../types/global";

const InfoBlock = ({label,body,editable,setValue}:{label:string,body:string,editable:boolean,setValue?:Dispatch<SetStateAction<string>>}) => {
  const contentText:DefaultRef = useRef(null);
  const cancelSpaces:any = (event:KeyboardEvent) => {
      if(event.shiftKey && event.key === 'Enter') {
          event.preventDefault();
      }
  }

  const inputFocus = () => {
    if(contentText.current) {
      contentText.current.style.display = 'none';
    }
  }

  const inputBlur = (event:any) => {
    if(!event.target.innerText.trim().length && contentText.current) {
      contentText.current.style.display = 'flex';
    }
  }

  return (
    <div className="body-info-block flex-center">
      <div onInput={(event:any) => {
        if(setValue) {
          setValue(event.target.innerText.trim());
        }
        }} onFocus={inputFocus} onBlur={inputBlur} onKeyDown={cancelSpaces} className="body-info-body" contentEditable={editable} data-label-text={label}>
          {!editable ? body : null}
      </div>
      {editable && <span className="edit-placeholder" ref={contentText}>{body}</span>}
    </div>
  )
}

export default InfoBlock;