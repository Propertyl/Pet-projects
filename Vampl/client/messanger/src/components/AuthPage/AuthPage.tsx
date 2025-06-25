import { ReactElement, Ref, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AuthInputs, AuthText, dialogText, SignData } from "../types/global";
import useSwitcher from "../../components/global-functions/useSwitcher";
import parsePassword from "./functions/parsePassword";
import auth from "./functions/sign";
import './auth.css';
import phoneValidation from "./functions/phoneValidation";
import nameValidation from "./functions/nameValidation";
import getLabelText from "./functions/authLabelText";
import useDebounceEffect from "../global-functions/useDebounceEffect";
import checkName from "../UserBurger/functions/checkingName";
import { useDispatch } from "react-redux";
import { dataApi } from "../../store/api/dataApi";
import { userApi } from "../../store/api/baseApi";
import { Dispatch } from "@reduxjs/toolkit";
import queryRequest from "../global-functions/queryRequest";
import restoreCursorPosition from "./functions/restoreCursorPos";
import changeStrokes from "./functions/changePhoneStrokes";
import { useNavigate } from "react-router";
import useCheckUserAuthorization from "../global-functions/checkUserAuthorization";

const insertDataField = (field:keyof SignData,value:string) => (data:SignData | null):SignData | null => {
  if(data) {
    data[field] = value;
    return data;
  }

  const newData:SignData = {phone:'',password:''};
  newData[field] = value;
  return newData;
}

const ErrorDialog = ({header,points}:dialogText) => {
  return (
    <div className="error-dialog">
      {header}
      {points.map((point,ind) => (
        <p key={`dialog-point-${ind}`} className="auth-label">{point}</p>
      ))}
    </div>
  )
}

const AuthPage = () => {
  const dispatch:Dispatch = useDispatch();
  const [phoneCodes,setPhoneCodes] = useState<ReactElement[] | null>([]);
  const phoneInput:Ref<HTMLDivElement | null> = useRef(null);
  const [phoneCode,setPhoneCode] = useState('+1');
  const [country,setCountry] = useState('United States');
  const codeSelector:Ref<HTMLDivElement | null> = useRef(null);
  const [codeOptions,setCodeOptions] = useState<boolean>(false);
  const [strokes,setStrokes] = useState<number>(11);
  const [currentWindow,setCurrentWindow] = useState<AuthInputs>('phone');
  const [inputError,setInputError] = useState<AuthInputs | ''>('');
  const [register,setRegister] = useState<Boolean | null>(null);
  const [inputData,setInputData] = useState<SignData | null>(null);  
  const [userInput,setInput] = useState<string>("");
  const switcher = useSwitcher(setCodeOptions);
  const [showPassword,setPassword] = useState<boolean>(false);
  const pwSwitcher = useSwitcher(setPassword);
  const [nameCorrect,setNameCorrect] = useState<boolean | null>(null);
  const [pageText,setPageText] = useState<AuthText | null>(null);
  const navigate = useNavigate();

  const changeCode = (code:string) => {
    if(code) {
      setPhoneCode(code);
    }

    if(phoneInput.current) {
      phoneInput.current.innerText = `${code ?? '+1'}`;
      const strokes = 12 - (phoneInput.current.innerText.length - 1);
      setStrokes(strokes);
      changeStrokes(strokes,phoneInput);
    }
  }

  useCheckUserAuthorization(dispatch,navigate);

  useLayoutEffect(() => {
    const getPageText = async () => {
      const [lang] = navigator.language.split('-');
      const {text} = await queryRequest(dataApi,'getPageText',{url:'getText',param:['auth',lang]},dispatch);
      document.title = text.title;
      setPageText(text);

      const fetchedCodes:Record<string,string> = await queryRequest(dataApi,'getSomeData',{url:'phoneCodes'},dispatch); 
      setPhoneCodes((_) => {
        const elements = [];

        for(const [index,code] of Object.entries(fetchedCodes)) {
          elements.push(
            <div onClick={() => changeValue(index,code as string)} className="code-option" key={`phoneCode-${index}`}>
            <p>{index}</p>
            <p className="code" >{String(code)}</p>
            </div>
          )
        }
         
        return elements;
      });

      connectEvents();
    }

    getPageText();
  },[]);


  const saveCursorPosition = (el:HTMLDivElement) => {
    const selection:Selection | null = window.getSelection();
    if (!selection) return null; 
    
    const range = selection.getRangeAt(0); 
    const preCaretRange = range.cloneRange(); 
    
    preCaretRange.selectNodeContents(el); 
    preCaretRange.setEnd(range.endContainer, range.endOffset); 

    const cursorPosition = preCaretRange.toString().length;
    return cursorPosition;
  }

  useDebounceEffect(() => {
    if(userInput && currentWindow === 'name') {
      checkName(userInput,setNameCorrect,dispatch);
    }
  },[userInput,currentWindow],500);


  const PhoneValidation = () => {
    if(phoneInput.current) {
      const cursorPosition = saveCursorPosition(phoneInput.current);
      const currentContent = phoneInput.current.innerText;
      const newStrokes = 12 - (phoneInput.current.innerText.length - 1);
      setStrokes(newStrokes);

      if(currentContent.length > 1 && inputError === 'phone') {
        setInputError('');
      }

      if(!/^[0-9+]*$/g.test(currentContent)) {
         phoneInput.current.innerText = currentContent.slice(0,-1);
         if(cursorPosition) {
            restoreCursorPosition(phoneInput.current,cursorPosition - 1);
         }
         return;
      }

      if(currentContent.length > 13) {
        phoneInput.current.innerText = currentContent.slice(0,-1);
        if(cursorPosition) {
          restoreCursorPosition(phoneInput.current,cursorPosition - 1);
        }
        phoneInput.current.blur();
        return;
      }

      changeStrokes(newStrokes,phoneInput);
    }
  }

  useEffect(() => {
     if(currentWindow === 'phone') {
       changeStrokes(strokes,phoneInput);
     }
  },[currentWindow]); 

  const WriteInput = <T extends React.SyntheticEvent<any>>(event:T) => {
    const target = event.target as HTMLInputElement;
    setInput(target.value);
    if(inputError) {
      setInputError('');
    }
  }

  const signActions = async () => {
     switch(currentWindow) {
        case 'phone':
         const currentPhone = phoneInput.current!.innerText;
         console.log('currentPHun:',currentPhone);
         if(!phoneValidation(currentPhone)) {
            setInputError('phone');
            break;
         }

         const res:{register:boolean} = await queryRequest(userApi,'getUserConvenientData',{url:'phone',param:currentPhone},dispatch); 

         setInputData(insertDataField('phone',currentPhone));
  
         setRegister(res.register);

         if(!res.register) {
            setCurrentWindow('name');
            break;
         } 
         
         setCurrentWindow('password');
         break;
        case 'name':
          if(nameValidation(userInput)) {
            setInputData(insertDataField('name',userInput));

            setInput('');
            setCurrentWindow('password');
            break;
          }

          setInputError('name');
          setInput('');
          break;
        case 'password':
        if(!parsePassword(userInput)) {
          setInputError('password');
          setInput('')
          break;
        }
        const finalData = inputData;
        if(finalData) {
          finalData['password'] = userInput;
        }
        setInputData(finalData);
        setInput('');
        const authReq:boolean = await auth(register ?? false,finalData,dispatch);
        if(!authReq) {
          setInputError('incorrect');
        } else {
          navigate('/');
        }
        break;
     }
  }

  const fastEnter = useCallback((event:KeyboardEvent) => {
    if(inputError) {
      setInputError('');
    }

    if(event.key === 'Enter') {
      event.preventDefault();
      signActions();
    }
  },[currentWindow,userInput,inputError]);

  const changeValue = (country:string,code:string) => {
     if(country) {
        setCountry(country);
     }

     changeCode(code);
  }

  const checkPaste = (event:ClipboardEvent | React.ClipboardEvent) => {
    const pasteData = event.clipboardData?.getData('text');
    event.preventDefault();
    if(pasteData && !/[A-Z,a-z]/g.test(pasteData)) {
      phoneInput.current!.innerText += pasteData;
      PhoneValidation();
    }
  }

  const BackToStart = () => {
    setInputData(null);
    setStrokes(11);
    setCurrentWindow('phone');
    setTimeout(connectEvents,0);
    setInputError('');
    setPassword(false);
    setInput('');
    setRegister(null);
  }

  const connectEvents = () => {
    if(phoneInput.current && codeSelector.current) {
      phoneInput.current.addEventListener('input',PhoneValidation);
      phoneInput.current.addEventListener('paste',checkPaste);
      codeSelector.current.addEventListener('blur',() => {
        setCodeOptions(false);
      });
      changeCode(phoneCode);
    }
  }

  useEffect(() => {
    document.addEventListener('keydown',fastEnter);

    return () => document.removeEventListener('keydown',fastEnter);

  },[fastEnter]);

    return (
      <>
        <section className="auth-page">
          <div className="container auth-list-container">
            {currentWindow !== 'phone' && <svg className="random-icon arrow-icon" onClick={BackToStart} width="64px" height="64px" viewBox="0 -6.5 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg"  fill="#da5050"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>left-arrow</title> <desc>Created with Sketch.</desc> <g id="icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="ui-gambling-website-lined-icnos-casinoshunter" transform="translate(-342.000000, -159.000000)" fill="#000000"  fillRule="nonzero"> <g id="square-filled" transform="translate(50.000000, 120.000000)"> <path d="M317.108012,39.2902857 L327.649804,49.7417043 L327.708994,49.7959169 C327.889141,49.9745543 327.986143,50.2044182 328,50.4382227 L328,50.5617773 C327.986143,50.7955818 327.889141,51.0254457 327.708994,51.2040831 L327.6571,51.2479803 L317.108012,61.7097143 C316.717694,62.0967619 316.084865,62.0967619 315.694547,61.7097143 C315.30423,61.3226668 315.30423,60.6951387 315.694547,60.3080911 L324.702666,51.3738496 L292.99947,51.3746291 C292.447478,51.3746291 292,50.9308997 292,50.3835318 C292,49.8361639 292.447478,49.3924345 292.99947,49.3924345 L324.46779,49.3916551 L315.694547,40.6919089 C315.30423,40.3048613 315.30423,39.6773332 315.694547,39.2902857 C316.084865,38.9032381 316.717694,38.9032381 317.108012,39.2902857 Z M327.115357,50.382693 L316.401279,61.0089027 L327.002151,50.5002046 L327.002252,50.4963719 L326.943142,50.442585 L326.882737,50.382693 L327.115357,50.382693 Z" id="left-arrow" transform="translate(310.000000, 50.500000) scale(-1, 1) translate(-310.000000, -50.500000) "> </path> </g> </g> </g> </g></svg>
            }
            <div className="auth-greetings-container container flex-center">
              <h1 className="auth-greetings-text flex-center">{register ? pageText?.greetings.old : register === null ? pageText?.greetings.start : pageText?.greetings.newbie}</h1>
            </div>
              <ul className="auth-list">
               { currentWindow === 'phone' &&
                <li className="auth-window">
                  <div className="container flex-center">
                    <div autoFocus tabIndex={0} onClick={switcher} className="code-selector" style={{pointerEvents:codeOptions ? 'none' : 'all'}} ref={codeSelector}   id="code-selector">
                   {country}
                    <svg className={`default-svg list-arrow ${codeOptions &&'list-arrow-active'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                     <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 4L6 10M12 4L18 10M12 4L12 14.5M12 20V17.5"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g>
                    </svg>
                        { codeOptions && 
                            <div className="code-options container flex-reverse">
                              {phoneCodes}
                            </div>
                        }
                   </div>
                  </div>
                  <div className="container flex-center">
                    <div className="input-container flex-center">
                      <span className={`${inputError === 'phone' && 'input-error'} input-cover container`} data-label-text={getLabelText(pageText?.inputs.phone,inputError)}>
                        <div className={`auth-input`} ref={phoneInput} dir="auto" contentEditable="true" inputMode="decimal"  data-left-pattern="">
                        </div>
                      </span>
                    </div>
                  </div>
                </li>
               }
               { currentWindow === 'name' &&
                  <li className="auth-window">
                    <div className="input-container">
                    <span className="input-cover container" data-label-text={nameCorrect === false ? 'This nickname is already taken' : getLabelText(pageText?.inputs.name,inputError)}>
                      <input  autoFocus={currentWindow === 'name'}  name="name-input" onInput={WriteInput} className={`auth-input ${inputError === 'name' && 'input-error'}`} type="text"/>
                    </span>
                    {inputError === 'name' && <ErrorDialog header={pageText?.dialog.name.header ?? '...'} points={pageText?.dialog.name.points ?? ['...']}/>
                    }
                    </div>
                  </li>
               }
               { currentWindow === 'password' && 
                <li className="auth-window">
                  <div className="input-container">
                    <span className="input-cover container" data-label-text={getLabelText(pageText?.inputs.password,inputError)}>
                      <input autoFocus={currentWindow === 'password'} className={`auth-input ${inputError === 'password' ? 'input-error' : ''}`} onChange={WriteInput} name="pass-input" value={userInput}  type={showPassword ? "text" : "password"}/>
                      <i className="random-icon">
                      {!showPassword && <span className="pass-visibility"></span>}
                        <svg className="pass-icon" onClick={pwSwitcher}  viewBox="0 -4 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>eyes [#90]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-380.000000, -7803.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M338.003976,7653.03136 C336.938673,7653.03136 335.9754,7652.60503 335.258196,7651.92289 C336.242476,7650.1343 336.242476,7647.90333 335.258196,7646.11474 C335.628301,7645.76264 336.064425,7645.48176 336.547562,7645.29116 C335.497264,7646.79486 336.067426,7648.94659 337.717894,7649.73204 C339.327351,7650.49844 341.286908,7649.64076 341.842065,7647.94847 C342.542264,7650.46433 340.620718,7653.03136 338.003976,7653.03136 M340.004544,7647.01254 C340.004544,7648.01568 338.003976,7648.01568 338.003976,7647.01254 C338.003976,7646.00941 340.004544,7646.00941 340.004544,7647.01254 M332.747483,7651.92289 C330.936969,7653.64528 327.94412,7653.26409 326.615743,7651.15148 C325.298369,7649.05392 326.247638,7646.19699 328.54529,7645.29116 C327.523,7646.75574 328.031144,7648.83925 329.60159,7649.67186 C331.215048,7650.52753 333.270632,7649.68289 333.839793,7647.94847 C334.237906,7649.37994 333.825789,7650.89769 332.747483,7651.92289 M331.001988,7646.00941 C332.002272,7646.00941 332.002272,7648.01568 331.001988,7648.01568 C330.001704,7648.01568 330.001704,7646.00941 331.001988,7646.00941 M338.003976,7643 C336.464539,7643 335.065141,7643.58583 334.00284,7644.54182 C330.202761,7641.12414 324,7643.9269 324,7649.01881 C324,7654.11073 330.202761,7656.91349 334.00284,7653.49581 C337.186744,7656.35976 342.404225,7654.94133 343.715597,7650.87161 C344.948947,7647.04464 342.010113,7643 338.003976,7643" id="eyes-[#90]"> </path> </g> </g> </g> </g></svg>
                      </i>
                    </span>
                    { inputError === 'password' && <ErrorDialog header={pageText?.dialog.password.header ?? '...'} points={pageText?.dialog.password.points ?? ['...']}/>}
                  </div>
                </li>
               }
               <button onClick={signActions} className="auth-button hidden-container flex-center">{ currentWindow === 'password' ? pageText?.button.end : pageText?.button.move }
               </button>
             </ul>
          </div>
        </section>
      </>
    )
}

export default AuthPage;