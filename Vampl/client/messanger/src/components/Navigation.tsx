import { Ref, useEffect, useRef, useState } from 'react';
import './styles/nav.css';
import changeTheme from './functions/changeTheme';
import serv from './functions/interceptors';
import { useDispatch, useSelector } from 'react-redux';
import triggerEffect from './functions/bubbleEffect';
import { switchBurger, switchUser } from '../store/useFullStaff';


const Navigation = () => {
  const themeSwitcher:Ref<HTMLDivElement | null> = useRef(null);
  const [themeOptions,setThemeOptions] = useState<boolean>(false);
  const name = useSelector((state:any) => state.user.userName);
  const burgerOpen = useSelector((state:any) => state.stuff.burgerOpen);
  const dispatch = useDispatch();
  const [searchRequest,setSearchRequest] = useState<string>('');
  const [searchActive,setSearchActive] = useState<boolean>(false);

  const switchTheme = async (theme:"night" | "light") => {
    const updatedTheme:any = await serv.put('/user/update-theme',{
      headers:{
        'Content-Type':'application/json'
      },
      theme:theme
    });

    changeTheme(updatedTheme.theme);
  }

  const closeThemes = () => {
    if(themeSwitcher.current) {
      const themes = themeSwitcher.current;
      setThemeOptions(false);
      themes.removeEventListener('animationend',closeThemes);
    }
  }

  const blurThemes = () => {
    if(themeSwitcher.current) {
     const themes = themeSwitcher.current;
     themes.classList.add('theme-options-close');
     themes.addEventListener('animationend',closeThemes);
    }
  }

  useEffect(() => {
    if(themeSwitcher.current && themeOptions) {
      themeSwitcher.current.focus();
    }
  },[themeSwitcher.current,themeOptions])

    return (
      <nav className="navigation">
      <div className="container nav-container">
          <div className="burger-menu-container nav-section">
            <button onClick={(event:any) => {
            triggerEffect(event);
            dispatch(switchBurger());
            if(burgerOpen) {
              dispatch(switchUser(''));
            } else {
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
              <div className={`input-form ${searchActive ? 'input-active' : ''}`}>
                  <div className='search-input-container'>
                    <input onFocus={() => setSearchActive(true)} onBlur={() => setSearchActive(false)} value={searchRequest} onChange={(event) => setSearchRequest(event.target.value)} className="search-input" placeholder="Search something..." type="search"/>
                    {searchRequest && <svg onClick={() => setSearchRequest('')} className='erase-icon random-icon' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
                    }
                  </div>
                  <button onClick={triggerEffect} className="search-button">
                    <i className="search-icon" style={{background:"url('./icon-search.svg') no-repeat center center / 60%"}}>{}</i>
                  </button>
              </div>
            </div>
          </div>
          <div className="theme-switcher-container nav-section">
            <button style={{pointerEvents:themeOptions ? 'none' : 'all'}} onClick={() => setThemeOptions(true)} className="theme-changer flex-center">
            Change theme
             {themeOptions && 
              <div className='theme-options'>
                  <div tabIndex={0} ref={themeSwitcher} onBlur={blurThemes}  className="theme-options-container container">
                  <div onClick={() => switchTheme('light')}className="theme-option">
                    <svg className='theme-icons' version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xmlSpace="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <circle fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" cx="32.003" cy="32.005" r="16.001"></circle> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M12.001,31.997c0-2.211-1.789-4-4-4H4c-2.211,0-4,1.789-4,4 s1.789,4,4,4h4C10.212,35.997,12.001,34.208,12.001,31.997z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M12.204,46.139l-2.832,2.833c-1.563,1.562-1.563,4.094,0,5.656 c1.562,1.562,4.094,1.562,5.657,0l2.833-2.832c1.562-1.562,1.562-4.095,0-5.657C16.298,44.576,13.767,44.576,12.204,46.139z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M32.003,51.999c-2.211,0-4,1.789-4,4V60c0,2.211,1.789,4,4,4 s4-1.789,4-4l-0.004-4.001C36.003,53.788,34.21,51.999,32.003,51.999z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M51.798,46.143c-1.559-1.566-4.091-1.566-5.653-0.004 s-1.562,4.095,0,5.657l2.829,2.828c1.562,1.57,4.094,1.562,5.656,0s1.566-4.09,0-5.656L51.798,46.143z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M60.006,27.997l-4.009,0.008 c-2.203-0.008-3.992,1.781-3.992,3.992c-0.008,2.211,1.789,4,3.992,4h4.001c2.219,0.008,4-1.789,4-4 C64.002,29.79,62.217,27.997,60.006,27.997z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M51.798,17.859l2.828-2.829c1.574-1.566,1.562-4.094,0-5.657 c-1.559-1.567-4.09-1.567-5.652-0.004l-2.829,2.836c-1.562,1.555-1.562,4.086,0,5.649C47.699,19.426,50.239,19.418,51.798,17.859z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M32.003,11.995c2.207,0.016,4-1.789,4-3.992v-4 c0-2.219-1.789-4-4-4c-2.211-0.008-4,1.781-4,3.993l0.008,4.008C28.003,10.206,29.792,11.995,32.003,11.995z"></path> <path fill-rule="evenodd" clip-rule="evenodd" fill="#231F20" d="M12.212,17.855c1.555,1.562,4.079,1.562,5.646-0.004 c1.574-1.551,1.566-4.09,0.008-5.649l-2.829-2.828c-1.57-1.571-4.094-1.559-5.657,0c-1.575,1.559-1.575,4.09-0.012,5.653 L12.212,17.855z"></path> </g> </g></svg>
                    Light
                  </div>
                  <div onClick={() => switchTheme('night')} className="theme-option">
                    <svg className='theme-icons' width="64px" height="64px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M46 44a26 26 0 0 1-24.94-33.36 24 24 0 1 0 32.3 32.3A26.24 26.24 0 0 1 46 44z"></path></g></svg>
                    Dark
                  </div>
                </div>
              </div>
            }
          </button>
          </div>
      </div>
    </nav>
  )
}

export default Navigation;