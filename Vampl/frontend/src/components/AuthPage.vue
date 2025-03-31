<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref} from 'vue';
import useChangeTitle from '../store/changeTitle';
import { useHead } from '@vueuse/head';
import type { AuthInputs, SignData } from '../types/global';
import useUserData from '../store/userData';
import { useRouter } from 'vue-router';
import auth from './functions/sign';
import parsePassword from './functions/parsePassword';
import triggerEffect from './functions/bubbleEffect';

  const phoneCodes = ref({});
  const phoneInput:any = ref(null);
  const selectedCode = ref('');
  const codeSelector:any = ref(null);
  const currentStrokesLength = ref(11);
  const title = useChangeTitle();
  const currentWindow:Ref<AuthInputs> = ref('phone');
  const inputError:Ref<AuthInputs | ''> = ref('');
  const register:Ref<Boolean> = ref(false);
  const inputData:SignData | any = {};
  const simpleInput = ref("");
  const userData = useUserData();
  const router = useRouter();

  title.changeTitle('Sign in');
  useHead({
    title:title.currentTitle
  });
  
  const changeCode = (event:any) => {
    if(event.target.value) {
      selectedCode.value = event.target.value;
    }
    phoneInput.value.innerText = `${selectedCode.value ?? '+1'}`;
    currentStrokesLength.value = 12 - (phoneInput.value.innerText.length - 1);
    changeStrokes();
  }

  const changeStrokes = () => {
    const newSpaces = "-".repeat(currentStrokesLength.value)
    .split('').map((stroke,i,arr) => {
      if(i % Math.floor(arr.length / 3) === 0) {
        return stroke + " ";
      }

      return stroke;
    }).join('');

    phoneInput.value.setAttribute('data-left-pattern',newSpaces);
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
    const cursorPosition = saveCursorPosition(phoneInput.value);
    const currentContent = phoneInput.value.innerText.replace(/\s/g,"");
    currentStrokesLength.value = 12 - (phoneInput.value.innerText.length - 1);

    if(currentContent.length > 1 && inputError.value === 'phone') {
      inputError.value = "";
    }
    
    if(!/^[0-9\+]*$/.test(currentContent)) {
       phoneInput.value.innerText = currentContent.slice(0,-1);
       restoreCursorPosition(phoneInput.value,cursorPosition - 1);
       return;
    }

    if(currentStrokesLength.value < 0) {
      phoneInput.value.innerText = currentContent.slice(0,-1);
      restoreCursorPosition(phoneInput.value,cursorPosition - 1);
      phoneInput.value.blur();
      return;
    }

    changeStrokes();
  }

  watch(currentWindow,() => {
    console.log('window changed!',currentWindow.value);
     if(currentWindow.value === 'phone') {
       changeStrokes();
     }
  }); 

  const WriteInput = (event:any) => {
    console.log('changed:',event.target.value);
    simpleInput.value = event.target.value;
    inputError.value = "";
  }

  const signActions = async () => {
     switch(currentWindow.value) {
        case 'phone':
         const currentPhone = phoneInput.value.innerText;
         if(currentPhone.length < 12) {
            inputError.value = 'phone';
            break;
         }

         const res = await fetch(`http://localhost:3000/user/phone/${currentPhone}`)
         .then(data => data.json());

         inputData['phone'] = currentPhone;
         console.log('register?:',res);
         register.value = res.register;

         if(!res.register) {
            currentWindow.value = 'name';
            break;
         } 
         
         currentWindow.value = 'password';
         break;
        case 'name':
         inputData['name'] = simpleInput.value;
         simpleInput.value = "";
         currentWindow.value = 'password';
          break;
        case 'password':
        console.log('simple:',simpleInput.value);
        if(!parsePassword(simpleInput.value)) {
          inputError.value = 'password';
          simpleInput.value = '';
          break;
        }

        inputData['password'] = simpleInput.value;
        inputData['ip'] = userData.ip;
        simpleInput.value = "";
        const authReq = auth(register,inputData,userData.ip);
        if((await authReq).window) {
          window.location.reload();
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

  onMounted(async () => {
    phoneCodes.value = await fetch("http://localhost:3000/getData/phoneCodes")
    .then(d => d.json());

    if(phoneInput.value) {
      phoneInput.value.addEventListener('input',PhoneValidation);
      codeSelector.value.addEventListener('change',changeCode);
      const event = new Event('change',{bubbles:true});
      codeSelector.value.dispatchEvent(event);
    }

    document.addEventListener('keydown',fastEnter);

  });

  onUnmounted(() => {
    if(phoneInput.value && codeSelector.value) {
      document.removeEventListener('keydown',fastEnter);
    }
  });
</script>

<template>
  <section class="auth-page">
    <div class="container auth-list-container">
        <ul class="auth-list">
         <li v-if="currentWindow === 'phone'" class="auth-window">
           <select v-model="selectedCode" autofocus class="code-selector" ref="codeSelector"  name="codes" id="code-selector">
              <option class="code-option"  v-for="(code,index) in phoneCodes" :value="code" :key="`phoneCode-${index}`">
                <p>{{ index }}</p>
                <p>{{ code }}</p>
              </option>
           </select>
           <div class="input-container">
            <label v-if="inputError !== 'phone'" class="auth-label" for="phone-input">Your Phone Number</label>
            <label v-else class="auth-label error-label" for="phone-input">Wrong Number</label>
           <div :class="{'input-error':inputError === 'phone'}"  class="auth-input" ref="phoneInput" dir="auto" contenteditable="true" inputmode="decimal" type="tel"  data-left-pattern="">
           </div>
           </div>
         </li>
         <li v-if="currentWindow === 'name'" class="auth-window">
           <div class="input-container">
            <label class="auth-label" for="name-input">Your Name</label>
            <input  :autofocus="currentWindow === 'name'"  name="name-input" :value="simpleInput" @change="WriteInput" class="auth-input"  type="text">
           </div>
         </li>
         <li v-if="currentWindow === 'password'" class="auth-window">
            <div class="input-container">
              <label class="auth-label" for="pass-input">Your password</label>
              <input :class="{'input-error':inputError === 'password'}" :autofocus="currentWindow === 'password'" class="auth-input" :value="simpleInput" @input="WriteInput" name="pass-input"  type="text">
              <label class="auth-label error-label" v-if="inputError === 'password'" for="pass-input">
                Password must contain:
                <p class="auth-label error-label">A-Z letter</p>
                <p class="auth-label error-label">0-9 number</p>
                <p class="auth-label error-label">minimum 8 symbols</p>
              </label>
            </div>
         </li>
         <button @click="(event:any) => {
            signActions();
            triggerEffect(event);
         }" class="auth-button">{{ currentWindow === 'password' ? 'Enter' : 'Next' }}</button>
       </ul>
    </div>
  </section>
</template>

<style scoped>
  .auth-input {
    position: relative;
    display: flex;
    align-items: center;
    background-color: var(--secondary-color);
    border: .2rem solid var(--bubble-color);
    border-radius: var(--default-border-radius);
    color:var(--black-default) !important;
    padding-left: .5rem;
    height: 5rem;
    min-width:70% ;
  }

  .auth-container {
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    padding-bottom: 10rem;
  }

  .auth-input:focus-within {
    outline: none;
    border-color:var(--night-color);
  }

  .auth-input::after {
    content: attr(data-left-pattern);
    color:var(--light-grey);
  }
  
  .input-error {
    border-color: var(--error-color) !important;
  }

  .auth-label {
    padding-left: .2rem;
    font-size: 1.3rem !important;
  }

  .error-label {
    color:var(--error-color) !important;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
  }

  .input-container * {
    margin: .2rem;
  }


  .auth-page {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    background-color: var(--bg-main);
  }

  .auth-page * {
    color: var(--secondary-color);
    font-weight: 500;
    font-size: 1.5rem;
  }


  .auth-list-container {
    justify-content: center;
    align-items: center;
  }

  .auth-list {
    position: relative;
     display: flex;
     flex-direction: column;
     padding: 0;
     margin: 0;
  }

  .auth-window {
    position: relative;
    width: 40rem;
    height: 30rem;
    display: inherit;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .auth-list > li,button {
    margin: .6rem 0;
  }

  .code-selector {
    width: 90%;
    height: 6rem;
    background-color: var(--chat-bg-color);
    padding: .5rem;
    outline: none;
    border-color: none;
    border-radius: var(--default-border-radius);
    scrollbar-color:var(--scrollbar-color);
    scrollbar-width:thin;
    cursor: pointer;
  }

  .code-option {
    cursor: pointer;
    padding-left: .2rem;
  }

  .code-option:hover {
    background-color: var(--night-color);
    
  }

  .code-option:checked {
    background-color: var(--night-color);
  }

  .code-selector::-webkit-scrollbar-track {
  background: var(--bg-main); 
  border-radius: 4px;
}

  .code-selector::-webkit-scrollbar-thumb {
     background: var(--light-grey);
  }

  .code-selector:focus {
    box-shadow: 0 0 .5rem var(--night-color);
    border-color: var(--night-color);
  }

  .input-container {
    width: 90%;
    display: flex;
  }

  .auth-button {
    position: relative;
    padding: 1rem;
    background-color: var(--night-color);
    border-radius:var(--default-border-radius);
    overflow: hidden;
  }

</style>