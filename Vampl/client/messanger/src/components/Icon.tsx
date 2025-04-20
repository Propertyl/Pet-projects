const Icon = ({SVG,cl}:{SVG:any,cl:string}) => {
  return (
    <i className={`${cl} random-icon`}>
        <SVG/>
    </i>
  )
}

export default Icon;