import { useSelector } from "react-redux";
import { Store } from "../../types/global";
import '../styles/userBurger.css';
import { RefObject, useEffect,useRef,useState } from "react";
import serv from "../functions/interceptors";
import { BurgerInfo } from "../types/global";
import { convertStatus } from "../functions/convertStatus";
import UserAvatar from "./userAvatar";

const NormalMode = ({burgerInfo}:{burgerInfo:BurgerInfo}) => {
  return (
    <>
      <div className="head-info-container container">
        <div className="container flex-center" style={{flexDirection:'column'}}>
          <UserAvatar image={burgerInfo.image} userName={burgerInfo.name}/>
          <div className="head-main-info">
            <p className="user-burger-name">{burgerInfo.name}</p>
            <p className="user-burger-status">
              status:{burgerInfo.status ?? 'Recently'}
              <span className="user-burger-status-dot"></span>
            </p>
          </div>
        </div>
      </div>
      <div className="body-info-container container">
        <div>
          <p>Phone</p>
          <p>{burgerInfo.phone}</p>
        </div>
        <div>
          <p>Username</p>
          <p>{burgerInfo.name}</p>
        </div>
        {burgerInfo.birthDate && 
        <div>
          <p>BirthDay</p>
          <p>{burgerInfo.birthDate}</p>
        </div>
        }
      </div>
    </>
  )
}


const EditMode = ({mode}:{mode:boolean | null}) => {
  return (
    <>
      <div style={{backgroundColor:'red'}} className={`user-burger-menu ${mode === null ? 'user-burger-menu-not-spawned' : mode ? 'user-burger-menu-appear' : 'user-burger-menu-disappear'}`}>
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
        setBurgerInfo(await serv.get(`/user/infoByName/${user}`));
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
       { burgerInfo && 
         <>
          { editMode ? <EditMode mode={editMode}/> : <NormalMode burgerInfo={burgerInfo}/>}
          <div>
            <button onClick={() => setEditMode(true)}>
              <svg width="64px" height="64px" viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon> </g> </g> </g> </g></svg>
            </button>
          </div>
         </>
       }
    </div>
  </section>
  )
}

export default UserBurger;