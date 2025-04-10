import { Ref, useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { AuthInputs, SignData, Store } from "../types/global";
import { useSelector } from "react-redux";
import useSwitcher from "../components/functions/useSwitcher";
import serv from "../components/functions/interceptors";
import parsePassword from "../components/functions/parsePassword";
import auth from "../components/functions/sign";
import triggerEffect from "../components/functions/bubbleEffect";
import '../components/styles/auth.css';

const AuthPage = () => {
  const ip = useSelector((state:Store) => state.user.ip);
  const [phoneCodes,setPhoneCodes] = useState<any>([]);
  const phoneInput:Ref<any | null> = useRef(null);
  const [phoneCode,setPhoneCode] = useState('+1');
  const [country,setCountry] = useState('United States');
  const codeSelector:Ref<HTMLDivElement | null> = useRef(null);
  const [codeOptions,setCodeOptions] = useState<Boolean>(false);
  const [strokes,setStrokes] = useState<number>(11);
  const [currentWindow,setCurrentWindow] = useState<AuthInputs>('phone');
  const [inputError,setInputError] = useState<AuthInputs | ''>('');
  const [register,setRegister] = useState<Boolean>(false);
  const inputData:SignData | any = {};  
  const [userInput,setInput] = useState<string>("");
  const switcher = useSwitcher(setCodeOptions);

  const changeCode = (code:string) => {
    if(code) {
      setPhoneCode(code);
    }

    phoneInput.current.innerText = `${code ?? '+1'}`;
    const strokes = 12 - (phoneInput.current.innerText.length - 1);
    setStrokes(strokes);
    changeStrokes(strokes);
  }

  const changeStrokes = (currentStrokes:number) => {
    console.log('strokes:',currentStrokes);
    const newSpaces = "-".repeat(currentStrokes)
    .split('').map((stroke,i,arr) => {
      if(i % Math.floor(arr.length / 3) === 0) {
        return stroke + " ";
      }

      return stroke;
    }).join('');

    phoneInput.current.setAttribute('data-left-pattern',newSpaces);
  }

  const saveCursorPosition = (el:any) => {
  const selection:any = window.getSelection();
  if (!selection.rangeCount) return null; // Если курсора нет, выходим
  
  const range = selection.getRangeAt(0); // Берём текущий диапазон выделения
  const preCaretRange = range.cloneRange(); // Копируем его
  
  preCaretRange.selectNodeContents(el); // Берём весь контент
  preCaretRange.setEnd(range.endContainer, range.endOffset); // Ставим конец в текущую позицию

  const cursorPosition = preCaretRange.toString().length; // Считаем длину текста до курсора
  return cursorPosition;
};

const restoreCursorPosition = (el:any, cursorPosition:any) => {
  const selection:any = window.getSelection();
  selection.removeAllRanges(); // Убираем старые выделения
  
  const range = document.createRange();
  let charCount = 0;
  
  const findPosition = (node:any) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharCount = charCount + node.length;
      
      if (cursorPosition <= nextCharCount) {
        range.setStart(node, cursorPosition - charCount);
        range.setEnd(node, cursorPosition - charCount);
        return true;
      }
      
      charCount = nextCharCount;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (findPosition(node.childNodes[i])) return true;
      }
    }
    return false;
  };

  findPosition(el);
  selection.addRange(range); // Восстанавливаем курсор
};

  const PhoneValidation = () => {
    const cursorPosition = saveCursorPosition(phoneInput.current);
    const currentContent = phoneInput.current.innerText.replace(/\s/g,"");
    console.log('current:',currentContent.length);
    const newStrokes = 12 - (phoneInput.current.innerText.length - 1);
    setStrokes(newStrokes);

    if(currentContent.length > 1 && inputError === 'phone') {
      setInputError('');
    }
    
    if(!/^[0-9\+]*$/.test(currentContent)) {
       phoneInput.current.innerText = currentContent.slice(0,-1);
       restoreCursorPosition(phoneInput.current,cursorPosition - 1);
       return;
    }

    if(strokes < 0) {
      phoneInput.current.innerText = currentContent.slice(0,-1);
      restoreCursorPosition(phoneInput.current,cursorPosition - 1);
      phoneInput.current.blur();
      return;
    }

    changeStrokes(newStrokes);
  }

  useEffect(() => {
     if(currentWindow === 'phone') {
       changeStrokes(strokes);
     }
  },[currentWindow]); 

  const WriteInput = (event:any) => {
    setInput(event.target.value);
    if(inputError) {
      setInputError('');
    }
  }

  const signActions = async () => {
    console.log('window:',currentWindow);
     switch(currentWindow) {
        case 'phone':
         const currentPhone = phoneInput.current.innerText;
         if(currentPhone.length < 12) {
            setInputError('phone');
            break;
         }

         const res:any = await serv.get(`/user/phone/${currentPhone}`);

         inputData['phone'] = currentPhone;
         console.log('register?:',res);
         setRegister(res.register);

         if(!res.register) {
            setCurrentWindow('name');
            break;
         } 
         
         setCurrentWindow('password');
         break;
        case 'name':
         inputData['name'] = userInput;
         setInput('');
         setCurrentWindow('password');
          break;
        case 'password':
        console.log('simple:',userInput);
        if(!parsePassword(userInput)) {
          setInputError('password');
          setInput('')
          break;
        }
        inputData['password'] = userInput;
        inputData['ip'] = ip;
        setInput('');
        const authReq:any = await auth(register,inputData,ip,inputError);
        console.log("AUTH:",authReq);
        if((await authReq).window === 'password') {
          setCurrentWindow('password');
        } else {
          window.location.href = "/";
        }
        break;
     }
  }

  const fastEnter = (event:KeyboardEvent) => {
    if(event.key === 'Enter') {
      event.preventDefault();
      signActions();
    }
  }

  const changeValue = (country:string,code:string) => {
     if(country) {
        setCountry(country);
     }

     changeCode(code);
  }

  const checkPaste = (event:ClipboardEvent | any) => {
    const pasteData = event.clipboardData.getData('text');
    event.preventDefault();
    if(!/[A-Z,a-z]/g.test(pasteData)) {
      phoneInput.current.innerText += pasteData;
      PhoneValidation();
    }
  }

  useEffect(() => {
    const setupPage = async () => {
      const fetchedCodes:any = await fetch("http://localhost:3000/getData/phoneCodes")
      .then(d => d.json());
       setPhoneCodes((_:any) => {
        const elements = [];

        for(const [index,code] of Object.entries(fetchedCodes)) {
          elements.push(
            <div onClick={() => changeValue(index,code as any)} className="code-option" key={`phoneCode-${index}`}>
            <p>{index as any}</p>
            <p className="code" >{code as any}</p>
            </div>
          )
        }
         
        return elements;
       });
  
      if(phoneInput.current && codeSelector.current) {
        phoneInput.current.addEventListener('input',PhoneValidation);
        phoneInput.current.addEventListener('paste',checkPaste);
        codeSelector.current.addEventListener('blur',() => {
          setCodeOptions(false);
        });
        changeCode(phoneCode);
      }
    } 

    setupPage();

    document.addEventListener('keydown',fastEnter);

    return () => document.removeEventListener('keydown',fastEnter);

  },[]);

    return (
      <>
        <Helmet>
            <title>Join to us</title>
        </Helmet>
        <section className="auth-page">
          <div className="container auth-list-container">
              <ul className="auth-list">
               { currentWindow === 'phone' &&
                <li className="auth-window">
                  <div tabIndex={0} onClick={switcher} className="code-selector" style={{pointerEvents:codeOptions ? 'none' : 'all'}} ref={codeSelector}   id="code-selector">
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
                  <div className="input-container">
                   {inputError !== 'phone' ? 
                   <label className="auth-label">Your Phone Number</label> :
                   <label className="auth-label error-label">Wrong Number</label>}
                   <div className={`${inputError === 'phone' && 'input-error'} auth-input`} ref={phoneInput} dir="auto" contentEditable="true" inputMode="decimal"  data-left-pattern="">
                   </div>
                  </div>
                </li>
               }
               { currentWindow === 'name' &&
                  <li className="auth-window">
                    <div className="input-container">
                     <label className="auth-label">Your Name</label>
                     <input  autoFocus={currentWindow === 'name'}  name="name-input" onInput={WriteInput} className="auth-input" type="text"/>
                    </div>
                  </li>
               }
               { currentWindow === 'password' && 
                <li className="auth-window">
                  <div className="input-container">
                    <label className="auth-label">Your password</label>
                    <input autoFocus={currentWindow === 'password'} className={`auth-input ${inputError === 'password' && 'input-error'}`} onChange={WriteInput} name="pass-input" value={userInput}  type="text" />
                    { inputError === 'password' && 
                      <label className="auth-label error-label">
                        Password must contain:
                        <p className="auth-label error-label">A-Z letter</p>
                        <p className="auth-label error-label">0-9 number</p>
                        <p className="auth-label error-label">minimum 8 symbols</p>
                      </label>
                    }
                    { inputError === 'incorrect' && 
                      <label className="auth-label error-label">Password incorrect for this user</label>
                    }
                  </div>
                </li>

               }
               <button onClick={(event:any) => {
                  signActions();
                  triggerEffect(event);
               }} className="auth-button hidden-container">{ currentWindow === 'password' ? 'Enter' : 'Next' }</button>
             </ul>
          </div>
        </section>
      </>
    )
}

export default AuthPage;