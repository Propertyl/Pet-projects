
const UserAvatar = ({image,userName,func}:{image:string,userName:string,func?:() => void}) => {
  return(
    <>
      <div onClick={func} className="avatar-container container flex-center">
        { image ?
          <img className="contact-image user-burger-avatar" src={image}/> : 
          <div className="contact-image unknown-image user-burger-avatar" data-unknown-name={userName.split('').shift()}></div>
        }
        {func && 
        <div style={{borderRadius:'50%'}} className="bg-dimmer flex-center">
            <svg className="random-icon change-avatar-icon" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z" fill="#ffffff"></path> <path d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z" fill="#ffffff"></path> <path d="M8 21H4C3.44772 21 3 20.5523 3 20V16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16V20C1 21.6569 2.34315 23 4 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21Z" fill="#ffffff"></path> <path d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z" fill="#ffffff"></path> <path d="M11 9C11 8.44771 11.4477 8 12 8C12.5523 8 13 8.44771 13 9V11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H13V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V13H9C8.44771 13 8 12.5523 8 12C8 11.4477 8.44771 11 9 11H11V9Z" fill="#ffffff"></path> </g></svg>
        </div>}
      </div>
    </>
  )
}

export default UserAvatar;