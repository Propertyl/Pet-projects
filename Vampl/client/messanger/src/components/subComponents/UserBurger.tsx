import { useSelector } from "react-redux";
import { Store } from "../../types/global";
import '../styles/userBurger.css';
import { useEffect,useState } from "react";
import serv from "../functions/interceptors";
import { BurgerInfo } from "../types/global";
import { convertStatus } from "../functions/convertStatus";


const UserBurger = () => {
  const isOpen = useSelector((state:Store) => state.stuff.burgerOpen);
  const user = useSelector((state:Store) => state.stuff.userInBurger);
  const [burgerOpened,setBurgerOpened] = useState<boolean>(false);
  const [burgerInfo,setBurgerInfo] = useState<null | BurgerInfo>(null);

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
      console.log('turn off');
      setBurgerInfo(null);
      
    }
  },[isOpen,burgerInfo])

  useEffect

  useEffect(() => {
    if(burgerInfo !== null && burgerInfo?.status === undefined) {
      const getStatus = async () => {
        if(burgerInfo) {
          const {status}:{status:Boolean} = await serv.get(`/getData/status/${burgerInfo.phone}`);
          console.log('status:',status);
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
    <section className={`user-burger-menu ${isOpen ? 'user-burger-menu-appear' : burgerOpened ? 'user-burger-menu-disappear' : 'user-burger-menu-not-spawned'}`}>
    <div className="container">
       { burgerInfo && 
         <>
          <div className="head-info-container">
            {burgerInfo.image ? 
             <img className="contact-image" src={burgerInfo.image}/> : 
             <div className="contact-image unknown-image" data-unknown-name={user.split('').shift()}/>}
            <p>{burgerInfo.name}</p>
            <p>status:{burgerInfo.status ?? 'Recently'}</p>
          </div>
         </>
       }
    </div>
  </section>
  )
}

export default UserBurger;