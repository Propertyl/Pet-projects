import { Dispatch, KeyboardEventHandler, SetStateAction, useRef } from "react";
import { useSelector } from "react-redux";
import parseBirthD from "../UserBurger/functions/parseBirthDay";
import { DefaultRef,Store } from "../types/global";

const cancelSpaces:KeyboardEventHandler<HTMLDivElement> = (event:React.KeyboardEvent) => {
  if(event.shiftKey && event.key === 'Enter') {
    event.preventDefault();
  }
}

const bodyContent = (body:string) => {
  if(['undefined','null'].includes(body)) {
    return "Not provided";
  }

  return body ?? "Not provided";
}

const InfoBlock = ({label,body,editable,setValue}:{label:string,body:string,editable:boolean,setValue?:Dispatch<SetStateAction<string>>}) => {
  const contentText:DefaultRef = useRef(null);
  const months = useSelector((store:Store) => store.user.allMonths);

  const inputFocus = () => {
    if(contentText.current) {
      contentText.current.style.display = 'none';
    }
  }

  const inputBlur = (event:React.FocusEvent) => {
    const target = event.target as HTMLDivElement;
    if(!target.innerText.trim().length && contentText.current) {
      contentText.current.style.display = 'flex';
    }
  }

  return (
    <div className="body-info-block flex-center">
      <div onInput={(event:React.FormEvent) => {
        const target = event.target as HTMLDivElement;
        if(setValue) {
          setValue(target.innerText.trim());
        }
        }} onFocus={inputFocus} onBlur={inputBlur} onKeyDown={cancelSpaces} className="body-info-body" contentEditable={editable} data-label-text={label}>
          {!editable ? bodyContent(label === 'Birthday' ? parseBirthD(body,months) : body) : null}
      </div>
      {editable && <span className="edit-placeholder" ref={contentText}>{body}</span>}
    </div>
  )
}

export default InfoBlock;