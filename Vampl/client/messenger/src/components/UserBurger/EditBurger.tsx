import { RefObject, useEffect, useRef, useState } from "react";
import { useBurgerContext } from "../context/BurgerContext";
import { DefaultRef, SetDispatch } from "../types/global";
import { useDispatch } from "react-redux";
import { useUpdateUserInfoMutation } from "../../store/api/baseApi";
import insertOptionalInfo from "./functions/optionalInfoInsert";
import bcrypt from "bcryptjs";
import validateBirthDate from "./functions/validateBirthDate";
import { switchUser } from "../../store/useFullStaff";
import { setData } from "../../store/user";
import useDebounceEffect from "../global-functions/useDebounceEffect";
import checkName from "./functions/checkingName";
import checkValueForUpdate from "./functions/checkValueForUpdate";
import validatePassword from "../AuthPage/functions/validatePassword";
import setupAvatar from "./functions/setupAvatar";
import { createPortal } from "react-dom";
import AvatarResizer from "../subComponents/AvatarResize";
import UserAvatar from "../subComponents/userAvatar";
import InfoBlock from "../subComponents/AccountInfoBlock";
import changeValue from "../global-functions/inputChangeHelper";
import DateOfBirthBlock from "../subComponents/DateBirthPicker";

const EditMode = ({mode,switchMode}:{mode:boolean | null,switchMode:SetDispatch<boolean | null>}) => {
  const {burgerInfo,setBurgerInfo,userBirthDate,setUserBirthDate,pageText,setPopUpMessage} = useBurgerContext();
  const [swapAnimation,setSwapAnimation] = useState<boolean>(false);
  const [newName,setNewName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [dataCorrect,setDataCorrect] = useState<boolean | null>(null);
  const [tempImage,setTempImage] = useState<string | null>(null);
  const editMenu:DefaultRef = useRef(null);
  const dispatch = useDispatch();
  const fileLoader:RefObject<HTMLInputElement | null> = useRef(null);
  const tempFile:RefObject<Blob | null> = useRef(null);
  const rootElem:DefaultRef = useRef(null);
  const [updateUserInfo] = useUpdateUserInfoMutation();

  const offMenu = () => {
    const menu = editMenu.current;
    if(tempFile.current || newName || userBirthDate || newPassword) {
      setBurgerInfo(null);
      setUserBirthDate(null);
    }

    switchMode(false);
    menu.removeEventListener('animationend',offMenu);
  }

  const updateUserData = async () => {
    const newData:{name?:string | undefined,birthData?:string,password?:string} = {};
    const birthDate = userBirthDate ? Object.values(userBirthDate).join('/') : '';
    const hash = await bcrypt.hash(newPassword,10);
    newData.name = insertOptionalInfo(Boolean(newName),newName);
    newData.birthData = insertOptionalInfo(Boolean(userBirthDate && validateBirthDate(userBirthDate)),birthDate); 
    newData.password = insertOptionalInfo(Boolean(newPassword),hash);
    await updateUserInfo(newData).unwrap();
    setSwapAnimation(true);

    if(Object.keys(newData).length) {
      setPopUpMessage(pageText?.pop_up_messages.updated);
    }

    if(newName) {
      dispatch(switchUser(newName));
      dispatch(setData({field:'userName',value:newName}));
    }
  }

  useDebounceEffect(() => {
    if(newName && burgerInfo?.name) {
      checkName(
        newName,
        setDataCorrect,
        dispatch,
        {
          existing:pageText!.pop_up_messages.name_exist,incorrect:pageText!.pop_up_messages.name
        },
        setPopUpMessage,
        burgerInfo.name
      );
    }

    if(newPassword && burgerInfo?.password) {   
      checkValueForUpdate(
        validatePassword(newPassword),
        setDataCorrect,
        setPopUpMessage,
        pageText?.pop_up_messages.password
      );
    }

    if(userBirthDate) {
      checkValueForUpdate(
        validateBirthDate(userBirthDate),
        setDataCorrect
      );
    }

  },[newName,newPassword,userBirthDate],300);

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
        <input ref={fileLoader} style={{display:'none'}} onChange={setupAvatar(tempFile,setTempImage)} type="file" />
        {tempImage &&
          createPortal(
            <AvatarResizer imageControl={[tempImage,setTempImage]} swapAnimation={setSwapAnimation} file={tempFile}/>,rootElem.current
          )
        }
        <section ref={editMenu} className={`user-burger-menu user-edit-burger-menu ${mode ? 'user-edit-burger-menu-appear' : swapAnimation ? 'user-edit-burger-menu-disappear' : 'user-burger-menu-not-spawned'}`}>
          <div style={{flexDirection:'column'}} className="container">
            <button className="edit-menu-button flex-center" onClick={() => setSwapAnimation(true)}>
              <svg className="random-icon edit-menu-button-icon"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.66088 8.53078C9.95402 8.23813 9.95442 7.76326 9.66178 7.47012C9.36913 7.17698 8.89426 7.17658 8.60112 7.46922L9.66088 8.53078ZM4.47012 11.5932C4.17698 11.8859 4.17658 12.3607 4.46922 12.6539C4.76187 12.947 5.23674 12.9474 5.52988 12.6548L4.47012 11.5932ZM5.51318 11.5771C5.21111 11.2936 4.73648 11.3088 4.45306 11.6108C4.16964 11.9129 4.18475 12.3875 4.48682 12.6709L5.51318 11.5771ZM8.61782 16.5469C8.91989 16.8304 9.39452 16.8152 9.67794 16.5132C9.96136 16.2111 9.94625 15.7365 9.64418 15.4531L8.61782 16.5469ZM5 11.374C4.58579 11.374 4.25 11.7098 4.25 12.124C4.25 12.5382 4.58579 12.874 5 12.874V11.374ZM15.37 12.124V12.874L15.3723 12.874L15.37 12.124ZM17.9326 13.1766L18.4614 12.6447V12.6447L17.9326 13.1766ZM18.25 15.7351C18.2511 16.1493 18.5879 16.4841 19.0021 16.483C19.4163 16.4819 19.7511 16.1451 19.75 15.7309L18.25 15.7351ZM8.60112 7.46922L4.47012 11.5932L5.52988 12.6548L9.66088 8.53078L8.60112 7.46922ZM4.48682 12.6709L8.61782 16.5469L9.64418 15.4531L5.51318 11.5771L4.48682 12.6709ZM5 12.874H15.37V11.374H5V12.874ZM15.3723 12.874C16.1333 12.8717 16.8641 13.1718 17.4038 13.7084L18.4614 12.6447C17.6395 11.8276 16.5267 11.3705 15.3677 11.374L15.3723 12.874ZM17.4038 13.7084C17.9435 14.245 18.2479 14.974 18.25 15.7351L19.75 15.7309C19.7468 14.572 19.2833 13.4618 18.4614 12.6447L17.4038 13.7084Z" fill="#000000"></path> </g></svg>
            </button>
            <div className="head-info-container container">
              <div className="container flex-center" style={{flexDirection:'column'}}>
                <span className="edit-avatar-container flex-center">
                  <UserAvatar image={burgerInfo.image} userName={burgerInfo.name} func={() => fileLoader.current?.click()}/>
                </span>
              </div>
            </div>
            <div className="body-info-container body-info-container-edit container">
                <span className="edit-block-container">
                  <InfoBlock label={pageText?.inputs.name ?? '...'} body={burgerInfo.name} editable={true} setValue={setNewName}/>
                </span>
                <span></span>
                <span className="edit-block-container">
                  <div className="body-info-block flex-center">
                    <div className="body-info-body body-info-password-body flex-center" data-label-text={pageText?.inputs.password ?? '...'}>
                      <input value={newPassword} onChange={changeValue(setNewPassword)} className="body-info-password-field container" type="password" />
                    </div>
                  </div>
                </span>
                <span className="edit-block-container">
                  <DateOfBirthBlock labelText={pageText?.inputs.birthday}/>
                </span>
            </div>
            <div className="footer-info-container container flex-center">
              {
               dataCorrect && <button onClick={updateUserData} title={pageText?.titles.confirm} className="edit-button confirm-button flex-center dimmed-button">
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

export default EditMode;