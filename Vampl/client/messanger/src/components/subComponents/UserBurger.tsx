import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../types/global";
import '../styles/userBurger.css';
import { Dispatch, RefObject, SetStateAction,useEffect,useRef,useState } from "react";
import { BurgerInfo, DateValues, DefaultRef } from "../types/global";
import { convertStatus } from "../functions/convertStatus";
import UserAvatar from "./userAvatar";
import InfoBlock from "./AccountInfoBlock";
import LoadingScreen from "./LoadingScreen";
import logOut from "../functions/logout";
import useDebounceEffect from "../functions/useDebounceEffect";
import { setData } from "../../store/user";
import checkName from "../functions/checkingName";
import AvatarResizer from "./AvatarResize";
import { createPortal } from "react-dom";
import { BurgerProvider, useBurgerContext } from "../context/BurgerContext";
import { switchUser } from "../../store/useFullStaff";
import { useUpdateUserInfoMutation,useLazyGetInfoByNameQuery } from "../../store/api/baseApi";
import { dataApi, useGetBurgerDataQuery } from "../../store/api/dataApi";
import saveValue from "../functions/setThenValue";
import DateOfBirthBlock from "./DateBirthPicker";
import validateBirthDate from "../functions/validateBirthDate";

const NormalMode = ({own}:{own:boolean}) => {
  const [more,setMore] = useState<boolean>(false);
  const {burgerInfo} = useBurgerContext();
  const moreMenuRef:DefaultRef = useRef(null);
  const dispatch = useDispatch();

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
                  <svg className="random-icon" width="64px" height="64px" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="F-More"> <path d="M12,16a2,2,0,1,1-2,2A2,2,0,0,1,12,16ZM10,6a2,2,0,1,0,2-2A2,2,0,0,0,10,6Zm0,6a2,2,0,1,0,2-2A2,2,0,0,0,10,12Z" id="Vertical"></path> </g> </g> </g></svg>
                  { more &&
                  <div className="moreMenu flex-center">
                    <div tabIndex={0} ref={moreMenuRef} onBlur={quitMenu} className="container flex-center moreMenu-container">
                      <div onClick={() => logOut(dispatch)} className="context-menu-option">
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
                <p className="user-burger-name flex-center">{burgerInfo.name}</p>
                <p className="user-burger-status flex-center">
                  {burgerInfo.status ?? 'Recently'}
                  <span className={`user-burger-status-dot status-${burgerInfo.status}`}></span>
                </p>
              </div>
            </div>
          </div>
          <div className="body-info-container container">
            <InfoBlock label={"Phone"} body={burgerInfo.phone} editable={false}/>
            <InfoBlock label={"Birthday"} body={`${burgerInfo.birthData}`} editable={false}/>
          </div>
        </>
      }
    </>
  )
}


const EditMode = ({mode,switchMode}:{mode:boolean | null,switchMode:Dispatch<SetStateAction<boolean | null>>}) => {
  const {burgerInfo,setBurgerInfo,userBirthDate} = useBurgerContext();
  const [swapAnimation,setSwapAnimation] = useState<boolean>(false);
  const [newName,setNewName] = useState<string>('');
  const [dataCorrect,setDataCorrect] = useState<boolean | null>(null);
  const editMenu:DefaultRef = useRef(null);
  const dispatch = useDispatch();
  const fileLoader:RefObject<HTMLInputElement | null> = useRef(null);
  const [tempImage,setTempImage] = useState<string | null>(null);
  const tempFile:RefObject<Blob | null> = useRef(null);
  const rootElem:DefaultRef = useRef(null);
  const [updateUserInfo] = useUpdateUserInfoMutation();

  const offMenu = () => {
    const menu = editMenu.current;
    if(tempFile.current || newName) {
      setBurgerInfo(null);
    }

    switchMode(false);
    menu.removeEventListener('animationend',offMenu);
  }

  const updateUserData = async () => {
    const newData:{name?:string,birthData?:string} = {};
    newData.name = newName ? newName : undefined;
    newData.birthData = userBirthDate && validateBirthDate(userBirthDate) ? Object.values(userBirthDate).join('/') : undefined;
    await updateUserInfo(newData).unwrap();
    setSwapAnimation(true);
    if(newName) {
      dispatch(switchUser(newName));
      dispatch(setData({field:'userName',value:newName}));
    }
  }

  const setupAvatar = (event:any) => {
    const file:Blob = event.target.files[0];
    const [type,fileType] = file.type.split('/');
    if(type === 'image' && ['png','jpeg','jpg','webp'].includes(fileType)) {
      tempFile.current = file;
      const reader = new FileReader;

      reader.readAsDataURL(file);

      reader.onload = () => {
        setTempImage(reader.result as string);
      }
    } else {
      console.error('this is not image');
    }

    event.target.value = "";
  }

  useDebounceEffect(() => {
    if (newName && burgerInfo?.name) {
      checkName(newName,setDataCorrect,burgerInfo.name);
    }
  },[newName],500);

  useEffect(() => {
    if(userBirthDate && validateBirthDate(userBirthDate)) {
      setDataCorrect(true);
    } else {
      setDataCorrect(null);
    }
  },[userBirthDate])

  useEffect(() => {
    if(!rootElem.current) {
      rootElem.current = document.getElementById('root');
    }
  },[]);

  useEffect(() => {
    if(swapAnimation && editMenu.current) {
      const menu = editMenu.current;
      menu.classList.add('user-edit-burger-menu-disappear');
      menu.addEventListener('animationend',offMenu);
    }
  },[swapAnimation]);

  return (
    <>
      {burgerInfo && 
      <>
        <input ref={fileLoader} style={{display:'none'}} onChange={setupAvatar} type="file" />
        {tempImage &&
        createPortal(<AvatarResizer imageControl={[tempImage,setTempImage]} swapAnimation={setSwapAnimation} file={tempFile}/>,rootElem.current)}
        <section ref={editMenu} className={`user-burger-menu 'user-edit-burger-menu-appear' ${mode ? 'user-edit-burger-menu-appear' : swapAnimation ? 'user-edit-burger-menu-disappear' : 'user-burger-menu-not-spawned'}`}>
          <div style={{flexDirection:'column'}} className="container">
            <button className="edit-menu-button flex-center" onClick={() => setSwapAnimation(true)}>
              <svg className="random-icon edit-menu-button-icon" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.66088 8.53078C9.95402 8.23813 9.95442 7.76326 9.66178 7.47012C9.36913 7.17698 8.89426 7.17658 8.60112 7.46922L9.66088 8.53078ZM4.47012 11.5932C4.17698 11.8859 4.17658 12.3607 4.46922 12.6539C4.76187 12.947 5.23674 12.9474 5.52988 12.6548L4.47012 11.5932ZM5.51318 11.5771C5.21111 11.2936 4.73648 11.3088 4.45306 11.6108C4.16964 11.9129 4.18475 12.3875 4.48682 12.6709L5.51318 11.5771ZM8.61782 16.5469C8.91989 16.8304 9.39452 16.8152 9.67794 16.5132C9.96136 16.2111 9.94625 15.7365 9.64418 15.4531L8.61782 16.5469ZM5 11.374C4.58579 11.374 4.25 11.7098 4.25 12.124C4.25 12.5382 4.58579 12.874 5 12.874V11.374ZM15.37 12.124V12.874L15.3723 12.874L15.37 12.124ZM17.9326 13.1766L18.4614 12.6447V12.6447L17.9326 13.1766ZM18.25 15.7351C18.2511 16.1493 18.5879 16.4841 19.0021 16.483C19.4163 16.4819 19.7511 16.1451 19.75 15.7309L18.25 15.7351ZM8.60112 7.46922L4.47012 11.5932L5.52988 12.6548L9.66088 8.53078L8.60112 7.46922ZM4.48682 12.6709L8.61782 16.5469L9.64418 15.4531L5.51318 11.5771L4.48682 12.6709ZM5 12.874H15.37V11.374H5V12.874ZM15.3723 12.874C16.1333 12.8717 16.8641 13.1718 17.4038 13.7084L18.4614 12.6447C17.6395 11.8276 16.5267 11.3705 15.3677 11.374L15.3723 12.874ZM17.4038 13.7084C17.9435 14.245 18.2479 14.974 18.25 15.7351L19.75 15.7309C19.7468 14.572 19.2833 13.4618 18.4614 12.6447L17.4038 13.7084Z" fill="#000000"></path> </g></svg>
            </button>
            <div className="head-info-container container">
              <div className="container flex-center" style={{flexDirection:'column'}}>
                <span className="edit-avatar-container flex-center">
                  <UserAvatar image={burgerInfo.image} userName={burgerInfo.name} func={() => fileLoader.current?.click()}/>
                </span>
              </div>
            </div>
            <div className="body-info-container container">
                <span className="edit-block-container">
                  {dataCorrect === false && 
                   <div className="nickname-exist-sign flex-center">
                      <p>This nickname is already taken</p>
                   </div>
                  }
                  <InfoBlock label={"Name"} body={burgerInfo.name} editable={true} setValue={setNewName}/>
                </span>
                <span className="edit-block-container">
                  <DateOfBirthBlock/>
                </span>
            </div>
            <div className="footer-info-container container flex-center">
              {
               dataCorrect && <button onClick={updateUserData} title="Confirm" className="edit-button confirm-button flex-center dimmed-button">
                  <svg className="random-icon edit-icon" fill="#000000" width="64px" height="64px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M.5 14a.5.5 0 0 0-.348.858l9.988 9.988a.5.5 0 1 0 .706-.706L.858 14.152A.5.5 0 0 0 .498 14zm28.99-9c-.13.004-.254.057-.345.15L12.163 22.13c-.49.47.236 1.197.707.707l16.982-16.98c.324-.318.077-.857-.363-.857z"></path></g></svg>
                </button>
              }
            </div>
          </div>
        </section>
      </>
      }
    </>    
  )
}

const BurgerBody = () => {
  const isOpen = useSelector((state:Store) => state.stuff.burgerOpen);
  const user = useSelector((state:Store) => state.stuff.userInBurger);
  const [trigger,{data:info}] = useLazyGetInfoByNameQuery();
  const {data:{isOwn} = false} = useGetBurgerDataQuery({url:'burger',param:info?.phone},{
    skip:!info
  });
  const [burgerOpened,setBurgerOpened] = useState<boolean>(false);
  const {burgerInfo,setBurgerInfo} = useBurgerContext();
  const [editMode,setEditMode] = useState<boolean | null>(null);
  const menuRef:RefObject<HTMLDivElement | null> = useRef(null);
  const dispatch = useDispatch();

  const clearData = () => {
    setEditMode(false);
    setBurgerInfo(null);
    dispatch(switchUser(''));
  }

  useEffect(() => {
    if(isOpen && !burgerOpened) {
      setBurgerOpened(true);
    }
  },[isOpen])

  useEffect(() => {
    if(!burgerInfo && user && isOpen) {
      trigger(user).unwrap()
      .then(saveValue(setBurgerInfo));
    }
  },[burgerInfo,user,isOpen])

  useEffect(() => {
    if(!isOpen && burgerInfo) {
      menuRef.current?.addEventListener('animationend',clearData);

      return () => {
        menuRef.current?.removeEventListener('animationend',clearData);
      }
    }
  },[isOpen,burgerInfo])

  useEffect(() => {
    if(burgerInfo !== null && burgerInfo?.status === undefined) {
      const getStatus = () => {
        if(burgerInfo) {
          const promise = dispatch(dataApi.endpoints.getBurgerData.initiate({url:'status',param:burgerInfo.phone}));

          promise.unwrap().then(({status}:{status:boolean}) => {
              if(status !== undefined) {
                setBurgerInfo((currentInfo:null | BurgerInfo) => {
                  if(currentInfo) {
                    return {...currentInfo,status:convertStatus(status)}
                  }

                  return null;
                });
              }
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
          { editMode && isOwn && <EditMode mode={editMode} switchMode={setEditMode}/>
          }
          <NormalMode own={isOwn}/>
          { isOwn && 
            <div className="footer-info-container container flex-center">
              <button title="Edit" className="edit-button flex-center dimmed-button" onClick={() => setEditMode(true)}>
                <svg className="random-icon edit-icon"  viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon> </g> </g> </g> </g></svg>
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

const UserBurger = () => {
  return (
    <BurgerProvider>
      <BurgerBody/>
    </BurgerProvider>
  )
}

export default UserBurger;