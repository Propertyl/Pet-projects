import { useEffect, useRef, useState } from "react";
import InfoBlock from "../subComponents/AccountInfoBlock";
import UserAvatar from "../subComponents/userAvatar";
import logOut from "./functions/logout";
import { useBurgerContext } from "../context/BurgerContext";
import { DefaultRef } from "../types/global";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { convertStatus } from "../global-functions/convertStatus";


const NormalMode = ({own}:{own:boolean}) => {
  const [more,setMore] = useState<boolean>(false);
  const {burgerInfo,pageText} = useBurgerContext();
  const moreMenuRef:DefaultRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const removeMenu = () => {
    const menu = moreMenuRef.current;
    setMore(false);
    menu.removeEventListener('animationend',removeMenu);
  }

  useEffect(() => {
    if(moreMenuRef.current && more) {
      moreMenuRef.current.focus();
    }
  },[moreMenuRef.current,more]);

  const quitMenu = () => {
    if(moreMenuRef.current) {
      const menu = moreMenuRef.current;
      menu.addEventListener('animationend',removeMenu);
      menu.classList.add('moreMenu-disappear');
    }
  }

  return (
    <>
      {burgerInfo && 
        <>
          <div className="head-info-container container">
            <div className="container flex-center" style={{flexDirection:'column'}}>
              { own && 
                <div style={{pointerEvents:more ? 'none' : 'all'}}  onClick={() => setMore(true)} className="additional-actions-container">
                  <svg className="random-icon" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="F-More"> <path d="M12,16a2,2,0,1,1-2,2A2,2,0,0,1,12,16ZM10,6a2,2,0,1,0,2-2A2,2,0,0,0,10,6Zm0,6a2,2,0,1,0,2-2A2,2,0,0,0,10,12Z" id="Vertical"></path> </g> </g> </g></svg>
                  { more &&
                  <div className="moreMenu flex-center">
                    <div tabIndex={0} ref={moreMenuRef} onBlur={quitMenu} className="container flex-center moreMenu-container">
                      <div onClick={() => logOut(dispatch,navigate)} className="context-menu-option">
                        <svg className="random-icon context-menu-icon log-out-icon" fill="#000000" viewBox="0 0 32.00 32.00" id="Outlined" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Fill"> <path d="M25,2H16V4h9a1,1,0,0,1,1,1V27a1,1,0,0,1-1,1H16v2h9a3,3,0,0,0,3-3V5A3,3,0,0,0,25,2Z"></path> <path d="M21.58,17V15H7l4-4L9.58,9.55l-5,5a2,2,0,0,0,0,2.83l5,5L11,21,7,17Z"></path> </g> </g></svg>
                        {pageText?.additional_menu}
                       </div>
                    </div>
                  </div>
                  }
                </div>
              }
              <UserAvatar image={burgerInfo.image} userName={burgerInfo.name}/>
              <div className="head-main-info">
                <p className="user-burger-name flex-center">{burgerInfo.name}</p>
                { burgerInfo.status !== undefined &&
                  <div className="user-burger-status flex-center">
                    {convertStatus(burgerInfo.status,pageText?.user_status.online,pageText?.user_status.offline)}
                    <span className={`user-burger-status-dot status-${convertStatus(burgerInfo.status,'Online','Offline')}`}></span>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="body-info-container container">
            <InfoBlock label={pageText?.inputs.phone ?? '...'} body={burgerInfo.phone} editable={false}/>
            <InfoBlock label={pageText?.inputs.birthday ?? '...'} body={`${burgerInfo.birthData}`} editable={false}/>
          </div>
        </>
      }
    </>
  )
}

export default NormalMode;