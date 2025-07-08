import { useDispatch, useSelector } from "react-redux";
import './userBurger.css';
import { RefObject,useEffect,useRef,useState } from "react";
import { BurgerInfo,BurgerText,Store } from "../types/global";
import { BurgerProvider, useBurgerContext } from "../context/BurgerContext";
import { switchUser } from "../../store/useFullStaff";
import {useLazyGetInfoByNameQuery } from "../../store/api/baseApi";
import { dataApi, useGetSomeDataQuery } from "../../store/api/dataApi";
import saveValue from "../global-functions/setThenValue";
import queryRequest from "../global-functions/queryRequest";
import useGetPageText from "../global-functions/getPageText";
import NormalMode from "./NormalBurger";
import EditMode from "./EditBurger";
import LoadingScreen from "../subComponents/LoadingScreen";

const BurgerBody = () => {
  const isOpen = useSelector((state:Store) => state.stuff.burgerOpen);
  const user = useSelector((state:Store) => state.stuff.userInBurger);
  const [trigger,{data:info}] = useLazyGetInfoByNameQuery();
  const {data:{isOwn} = false} = useGetSomeDataQuery({url:'burger',param:info?.phone},{
    skip:!info
  });
  const [burgerOpened,setBurgerOpened] = useState<boolean>(false);
  const {burgerInfo,setBurgerInfo,setPageText,pageText,popUpMessage,setPopUpMessage} = useBurgerContext();
  const [editMode,setEditMode] = useState<boolean | null>(null);
  const menuRef:RefObject<HTMLDivElement | null> = useRef(null);
  const dispatch = useDispatch();

  const clearData = () => {
    setEditMode(false);
    setBurgerInfo(null);
    dispatch(switchUser(''));
  }

  useGetPageText<BurgerText>(setPageText,'burger',dispatch);

  useEffect(() => {
    if(isOpen && !burgerOpened) {
      setBurgerOpened(true);
    }
  },[isOpen]);

  useEffect(() => {
    if(!burgerInfo && user && isOpen) {
      trigger(user).unwrap()
      .then(saveValue(setBurgerInfo));
    }
  },[burgerInfo,user,isOpen]);

  useEffect(() => {
    if(!isOpen && burgerInfo) {
      menuRef.current?.addEventListener('animationend',clearData);

      return () => {
        menuRef.current?.removeEventListener('animationend',clearData);
      }
    }
  },[isOpen,burgerInfo]);

  useEffect(() => {
    if(burgerInfo !== null && burgerInfo?.status === undefined && pageText) {
      const getStatus = async () => {
          await queryRequest(dataApi,'getSomeData',{url:'status',param:burgerInfo.phone},dispatch)
          .then(({status}:{status:boolean}) => {
              if(status !== undefined) {
                setBurgerInfo((currentInfo:null | BurgerInfo) => {
                  if(currentInfo) {
                    return {...currentInfo,status};
                  }

                  return currentInfo;
                });
              }
          });
      }
  
      getStatus();
    }
  },[burgerInfo,pageText]);

  return (
    <section ref={menuRef} className={`user-burger-menu ${isOpen ? 'user-burger-menu-appear' : burgerOpened ? 'user-burger-menu-disappear' : 'user-burger-menu-not-spawned'} flex-center`}>
      {popUpMessage && 
       <div key={`message-${popUpMessage}`} className="user-burger-pop-up-message flex-center" onAnimationEnd={() => setPopUpMessage('')}>
          <p className="pop-up-message-text">{popUpMessage}</p>
       </div>
      }
    <div className="container" style={{flexDirection:'column'}}>
       { burgerInfo ? 
         <>
          { editMode && isOwn && <EditMode mode={editMode} switchMode={setEditMode}/>
          }
          <NormalMode own={isOwn}/>
          { isOwn && 
            <div className="footer-info-container container flex-center">
              <button title={pageText?.titles.edit} className="edit-button flex-center dimmed-button" onClick={() => setEditMode(true)}>
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




