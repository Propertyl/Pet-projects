import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../types/global";
import '../styles/userBurger.css';
import { RefObject, useEffect,useRef,useState } from "react";
import serv from "../functions/interceptors";
import { BurgerInfo, DefaultRef } from "../types/global";
import { convertStatus } from "../functions/convertStatus";
import UserAvatar from "./userAvatar";
import InfoBlock from "./AccountInfoBlock";
import LoadingScreen from "./LoadingScreen";
import logOut from "../functions/logout";

const NormalMode = ({burgerInfo,own}:{burgerInfo:BurgerInfo,own:boolean}) => {
  const [more,setMore] = useState<boolean>(false);
  const moreMenuRef:DefaultRef = useRef(null);
  const disptach = useDispatch();

  const removeMenu = () => {
    const menu = moreMenuRef.current;
    setMore(false);
    menu.removeEventListener('animationend',removeMenu);
  }

  useEffect(() => {
    if(moreMenuRef.current && more) {
      moreMenuRef.current.focus();
    }
  },[moreMenuRef.current,more])

  const quitMenu = () => {
    if(moreMenuRef.current) {
      const menu = moreMenuRef.current;
      menu.addEventListener('animationend',removeMenu);
      menu.classList.add('moreMenu-disappear');
    }
  }

  return (
    <>
      <div className="head-info-container container">
        <div className="container flex-center" style={{flexDirection:'column'}}>
          { own && 
            <div style={{pointerEvents:more ? 'none' : 'all'}}  onClick={() => setMore(true)} className="additional-actions-container">
              <svg className="random-icon" width="64px" height="64px" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="F-More"> <path d="M12,16a2,2,0,1,1-2,2A2,2,0,0,1,12,16ZM10,6a2,2,0,1,0,2-2A2,2,0,0,0,10,6Zm0,6a2,2,0,1,0,2-2A2,2,0,0,0,10,12Z" id="Vertical"></path> </g> </g> </g></svg>
              { more &&
              <div className="moreMenu flex-center">
                <div tabIndex={0} ref={moreMenuRef} onBlur={quitMenu} className="container flex-center moreMenu-container">
                  <div onClick={() => logOut(disptach)} className="context-menu-option">
                   <svg className="random-icon context-menu-icon log-out-icon" fill="#000000" width="64px" height="64px" viewBox="0 0 32.00 32.00" id="Outlined" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Fill"> <path d="M25,2H16V4h9a1,1,0,0,1,1,1V27a1,1,0,0,1-1,1H16v2h9a3,3,0,0,0,3-3V5A3,3,0,0,0,25,2Z"></path> <path d="M21.58,17V15H7l4-4L9.58,9.55l-5,5a2,2,0,0,0,0,2.83l5,5L11,21,7,17Z"></path> </g> </g></svg>
                   <p>Log Out</p>
                   </div>
                </div>
              </div>
              }
            </div>
          }
          <UserAvatar image={burgerInfo.image} userName={burgerInfo.name}/>
          <div className="head-main-info">
            <p className="user-burger-name">{burgerInfo.name}</p>
            <p className="user-burger-status">
              {burgerInfo.status ?? 'Recently'}
              <span className={`user-burger-status-dot status-${burgerInfo.status}`}></span>
            </p>
          </div>
        </div>
      </div>
      <div className="body-info-container container">
        <InfoBlock label={"Phone"} body={burgerInfo.phone} editable={false}/>
        <InfoBlock label={"Name"} body={burgerInfo.name} editable={false}/>
        {burgerInfo.birthDate && 
        <InfoBlock label={"Birthday"} body={`${burgerInfo.birthDate}`} editable={false}/>
        }
      </div>
    </>
  )
}


const EditMode = ({mode}:{mode:boolean | null}) => {
  return (
    <>
      <div style={{backgroundColor:'purple'}} className={`user-burger-menu ${mode === null ? 'user-burger-menu-not-spawned' : mode ? 'user-edit-burger-menu-appear' : 'user-edit-burger-menu-disappear'}`}>
          EditMode
      </div>
    </>
  )
}


const UserBurger = () => {
  const isOpen = useSelector((state:Store) => state.stuff.burgerOpen);
  const user = useSelector((state:Store) => state.stuff.userInBurger);
  const [burgerOpened,setBurgerOpened] = useState<boolean>(false);
  const [burgerInfo,setBurgerInfo] = useState<null | BurgerInfo>(null);
  const [editMode,setEditMode] = useState<boolean | null>(null);
  const menuRef:RefObject<HTMLDivElement | null> = useRef(null);
  const [isOwn,setIsOwn] = useState<boolean>(false);

  const clearData = () => {
    setEditMode(false);
    setBurgerInfo(null);
  }

  useEffect(() => {
    if(isOpen) {
      setBurgerOpened(true);
    }
  },[isOpen])

  useEffect(() => {
    const getAccountInfo = async () => {
      if(user && !burgerInfo) {
        const info:BurgerInfo = await serv.get(`/user/infoByName/${user}`);
        setBurgerInfo(info);
        const whoseBurger:{isOwn:boolean} = await serv.get(`/getData/burger/${info.phone}`);
        setIsOwn(whoseBurger.isOwn);
      }
    }

    getAccountInfo();
  },[user,burgerInfo])

  useEffect(() => {
    if(!isOpen && burgerInfo) {
      menuRef.current?.addEventListener('animationend',clearData);

      return () => {
        menuRef.current?.removeEventListener('animationend',clearData);
      }
    }
  },[isOpen,burgerInfo])

  useEffect

  useEffect(() => {
    if(burgerInfo !== null && burgerInfo?.status === undefined) {
      const getStatus = async () => {
        if(burgerInfo) {
          const {status}:{status:Boolean} = await serv.get(`/getData/status/${burgerInfo.phone}`);
          setBurgerInfo((currentInfo:null | BurgerInfo) => {
             if(currentInfo) {
                return {...currentInfo,status:convertStatus(status)}
             }

             return null;
          });
        }
      }
  
      getStatus();
    }
  },[burgerInfo])

  return (
    <section ref={menuRef} className={`user-burger-menu ${isOpen ? 'user-burger-menu-appear' : burgerOpened ? 'user-burger-menu-disappear' : 'user-burger-menu-not-spawned'}`}>
    <div className="container" style={{flexDirection:'column'}}>
       { burgerInfo ? 
         <>
          { editMode && isOwn && <EditMode mode={editMode}/>}
          <NormalMode burgerInfo={burgerInfo} own={isOwn}/>
          { isOwn && 
            <div>
              <button onClick={() => setEditMode(true)}>
                <svg width="64px" height="64px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon> </g> </g> </g> </g></svg>
              </button>
            </div>
          }
         </> 
          :
          <LoadingScreen/>
       }
    </div>
  </section>
  )
}

export default UserBurger;