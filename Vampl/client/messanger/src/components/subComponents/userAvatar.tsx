
const UserAvatar = ({image,userName,func}:{image:string,userName:string,func?:() => void}) => {
  return(
    <>
      { image ?
        <img className="contact-image user-burger-avatar" src={image}/> : 
        <div className="contact-image unknown-image user-burger-avatar" data-unknown-name={userName.split('').shift()}></div>
      }
    </>
  )
}

export default UserAvatar;