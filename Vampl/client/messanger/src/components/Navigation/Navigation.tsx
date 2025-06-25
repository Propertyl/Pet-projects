import { useEffect, useRef, useState } from 'react';
import './nav.css';
import changeTheme from './functions/changeTheme';
import { useDispatch, useSelector } from 'react-redux';
import triggerEffect from '../global-functions/bubbleEffect';
import { switchBurger, switchUser } from '../../store/useFullStaff';
import { useGetUserConvenientDataQuery, useUpdateUserThemeMutation } from '../../store/api/baseApi';
import { MoonIcon, SunIcon } from '../subComponents/Icons';
import SearchResults from '../subComponents/searchResults';
import textChanger from './functions/textChanger';
import { Store } from '../types/global';

const Navigation = () => {
  const bubbleSpawner = useRef(triggerEffect());
  const name = useSelector((state:Store) => state.user.userName);
  const burgerOpen = useSelector((state:Store) => state.stuff.burgerOpen);
  const dispatch = useDispatch();
  const [searchRequest,setSearchRequest] = useState<string>('');
  const {data:userTheme} = useGetUserConvenientDataQuery({url:'get-theme'});
  const [currentTheme,setCurrentTheme] = useState<"night" | "light" | ''>('');
  const [updateUserTheme] = useUpdateUserThemeMutation();

  const switchTheme = async (theme:"night" | "light") => {
    await updateUserTheme({theme:theme}).unwrap();

    changeTheme(theme);
    setCurrentTheme(theme);
  }

  const alternateTheme = () => {
    return currentTheme === 'light' ? 'night' : 'light';
  }

  useEffect(() => {
    if(userTheme) {
      setCurrentTheme(userTheme.theme);
    }
  },[userTheme])

    return (
      <nav className="navigation">
      <div className="container nav-container">
          <div className="burger-menu-container nav-section">
            <button onClick={(event) => {
            bubbleSpawner.current(event);
            dispatch(switchBurger());
            if(!burgerOpen) {
              dispatch(switchUser(name));
            }
            }} className={`${burgerOpen && 'close-burger'} burger-menu`}>
              <span className="burger-line"></span>
              <span className="burger-line"></span>
              <span className="burger-line"></span>
            </button>
          </div>
          <div className="search-section-container nav-section">
            <div className="search-section">
              <div className={`input-form`}>
                  <div className='search-input-container'>
                    <span className='search-icon-container flex-center'>
                      <svg className='random-icon search-icon' width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    </span>
                    <input value={searchRequest} onChange={(event) => setSearchRequest(event.target.value)} className="search-input" placeholder={textChanger('Кого хочете знайти?','Who do you want to find?')} type="search"/>
                    {searchRequest && <svg onClick={() => setSearchRequest('')} className='erase-icon random-icon' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#000000" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
                    }
                  </div>
                  {searchRequest && <SearchResults request={searchRequest}/>}
              </div>
            </div>
          </div>
          <div className='theme-switcher-container nav-section'>
            <div onClick={() => switchTheme(alternateTheme())} className='theme-switcher flex-center'>
              { userTheme && 
              <span className={`current-theme ${currentTheme ? 'theme-active' : ''} ${currentTheme}-icon`}>
                {currentTheme && currentTheme === 'light' ? <SunIcon/> : <MoonIcon/>}
              </span>
              }
            </div>
          </div>
      </div>
    </nav>
  )
}

export default Navigation;

