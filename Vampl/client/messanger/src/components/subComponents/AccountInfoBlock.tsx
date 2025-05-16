
const InfoBlock = ({label,body,editable}:{label:string,body:string,editable:boolean}) => {
  const cancelSpaces:any = (event:KeyboardEvent) => {
      if(event.shiftKey && event.key === 'Enter') {
          event.preventDefault();
      }
  }

  return (
    <div className="body-info-block flex-center">
      <div onKeyDown={cancelSpaces} className="body-info-body" contentEditable={editable} data-label-text={label}>{body}</div>
    </div>
  )
}

export default InfoBlock;