import { Dispatch, SetStateAction, useRef } from "react";
import { DefaultRef, Store } from "../../types/global";
import { useSelector } from "react-redux";
import parseBirthD from "../functions/parseBirthDay";

const cancelSpaces:any = (event:KeyboardEvent) => {
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
          {!editable ? bodyContent(label === 'Birthday' ? parseBirthD(body,months) : body) : null}
      </div>
      {editable && <span className="edit-placeholder" ref={contentText}>{body}</span>}
    </div>
  )
}

export default InfoBlock;