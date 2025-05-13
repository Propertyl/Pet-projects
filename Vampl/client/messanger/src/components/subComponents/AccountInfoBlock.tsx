
const InfoBlock = ({label,body,editable}:{label:string,body:string,editable:boolean}) => {
  return (
    <div className="body-info-block">
      <p>{label}</p>
      <div contentEditable={editable}>{body}</div>
    </div>
  )
}

export default InfoBlock;