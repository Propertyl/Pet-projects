<script setup lang="ts" >
import useUsefulStuff from '../../store/usefulStuff';
import triggerEffect from '../functions/bubbleEffect';
import {ref,watch} from 'vue';

const usefulStuff = useUsefulStuff();
const themeOptions = ref(false);
const themeSwitcher = ref(null);

const changeTheme = (theme:"night" | "light") => {
  const html = document.getElementById('root');
  if(html) {
    html.className = theme;
  }
}

watch(themeOptions, (newValue) => {
  if (newValue) {
    themeSwitcher.value.addEventListener("blur",switcher);
  } else {
    themeSwitcher.value.removeEventListener("blur",switcher);
  }
});

const switcher = () => {
  themeOptions.value = !themeOptions.value;
}

</script>


<template>
  <nav class="navigation">
    <div class="container nav-container">
      <button :class="{'close-burger':usefulStuff.burgerOpen}" @click="(event:any) => {
        triggerEffect(event);
        usefulStuff.switchBurger();
      }" class="burger-menu">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>
        <div class="search-section">
          <input class="search-input" placeholder="Search something..." type="search">
          <button @click="(event:any) => triggerEffect(event)"  class="search-button">
            <i class="search-icon" style="background: url('./icon-search.svg') no-repeat center center / 60%;">{{  }}</i>
          </button>
        </div>
        <div tabindex="0" ref="themeSwitcher" @click="switcher" class="theme-changer flex-center">
          Change theme
            <div v-if="themeOptions"  class="theme-options">
              <div @click="() => changeTheme('light')" class="theme-option">
                <svg class="theme-icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fcfcfc"  viewBox="0 0 240 240" version="1.1" id="Layer_1" style="enable-background:new 0 0 240 240" xml:space="preserve" stroke="#fcfcfc">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <g> <path d="M58.57,25.81c-2.13-3.67-0.87-8.38,2.8-10.51c3.67-2.13,8.38-0.88,10.51,2.8l9.88,17.1c2.13,3.67,0.87,8.38-2.8,10.51 c-3.67,2.13-8.38,0.88-10.51-2.8L58.57,25.81L58.57,25.81z M120,51.17c19.01,0,36.21,7.7,48.67,20.16 C181.12,83.79,188.83,101,188.83,120c0,19.01-7.7,36.21-20.16,48.67c-12.46,12.46-29.66,20.16-48.67,20.16 c-19.01,0-36.21-7.7-48.67-20.16C58.88,156.21,51.17,139.01,51.17,120c0-19.01,7.7-36.21,20.16-48.67 C83.79,58.88,101,51.17,120,51.17L120,51.17z M158.27,81.73c-9.79-9.79-23.32-15.85-38.27-15.85c-14.95,0-28.48,6.06-38.27,15.85 c-9.79,9.79-15.85,23.32-15.85,38.27c0,14.95,6.06,28.48,15.85,38.27c9.79,9.79,23.32,15.85,38.27,15.85 c14.95,0,28.48-6.06,38.27-15.85c9.79-9.79,15.85-23.32,15.85-38.27C174.12,105.05,168.06,91.52,158.27,81.73L158.27,81.73z M113.88,7.71c0-4.26,3.45-7.71,7.71-7.71c4.26,0,7.71,3.45,7.71,7.71v19.75c0,4.26-3.45,7.71-7.71,7.71 c-4.26,0-7.71-3.45-7.71-7.71V7.71L113.88,7.71z M170.87,19.72c2.11-3.67,6.8-4.94,10.48-2.83c3.67,2.11,4.94,6.8,2.83,10.48 l-9.88,17.1c-2.11,3.67-6.8,4.94-10.48,2.83c-3.67-2.11-4.94-6.8-2.83-10.48L170.87,19.72L170.87,19.72z M214.19,58.57 c3.67-2.13,8.38-0.87,10.51,2.8c2.13,3.67,0.88,8.38-2.8,10.51l-17.1,9.88c-3.67,2.13-8.38,0.87-10.51-2.8 c-2.13-3.67-0.88-8.38,2.8-10.51L214.19,58.57L214.19,58.57z M232.29,113.88c4.26,0,7.71,3.45,7.71,7.71 c0,4.26-3.45,7.71-7.71,7.71h-19.75c-4.26,0-7.71-3.45-7.71-7.71c0-4.26,3.45-7.71,7.71-7.71H232.29L232.29,113.88z M220.28,170.87 c3.67,2.11,4.94,6.8,2.83,10.48c-2.11,3.67-6.8,4.94-10.48,2.83l-17.1-9.88c-3.67-2.11-4.94-6.8-2.83-10.48 c2.11-3.67,6.8-4.94,10.48-2.83L220.28,170.87L220.28,170.87z M181.43,214.19c2.13,3.67,0.87,8.38-2.8,10.51 c-3.67,2.13-8.38,0.88-10.51-2.8l-9.88-17.1c-2.13-3.67-0.87-8.38,2.8-10.51c3.67-2.13,8.38-0.88,10.51,2.8L181.43,214.19 L181.43,214.19z M126.12,232.29c0,4.26-3.45,7.71-7.71,7.71c-4.26,0-7.71-3.45-7.71-7.71v-19.75c0-4.26,3.45-7.71,7.71-7.71 c4.26,0,7.71,3.45,7.71,7.71V232.29L126.12,232.29z M69.13,220.28c-2.11,3.67-6.8,4.94-10.48,2.83c-3.67-2.11-4.94-6.8-2.83-10.48 l9.88-17.1c2.11-3.67,6.8-4.94,10.48-2.83c3.67,2.11,4.94,6.8,2.83,10.48L69.13,220.28L69.13,220.28z M25.81,181.43 c-3.67,2.13-8.38,0.87-10.51-2.8c-2.13-3.67-0.88-8.38,2.8-10.51l17.1-9.88c3.67-2.13,8.38-0.87,10.51,2.8 c2.13,3.67,0.88,8.38-2.8,10.51L25.81,181.43L25.81,181.43z M7.71,126.12c-4.26,0-7.71-3.45-7.71-7.71c0-4.26,3.45-7.71,7.71-7.71 h19.75c4.26,0,7.71,3.45,7.71,7.71c0,4.26-3.45,7.71-7.71,7.71H7.71L7.71,126.12z M19.72,69.13c-3.67-2.11-4.94-6.8-2.83-10.48 c2.11-3.67,6.8-4.94,10.48-2.83l17.1,9.88c3.67,2.11,4.94,6.8,2.83,10.48c-2.11,3.67-6.8,4.94-10.48,2.83L19.72,69.13L19.72,69.13z"/> </g> </g>
              </svg>
                Light
              </div>
              <div @click="() => changeTheme('night')" class="theme-option">
                <svg class="theme-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <path d="M14.5739 1.11056L13.7826 2.69316C13.7632 2.73186 13.7319 2.76325 13.6932 2.7826L12.1106 3.5739C11.9631 3.64761 11.9631 3.85797 12.1106 3.93167L13.6932 4.72297C13.7319 4.74233 13.7632 4.77371 13.7826 4.81241L14.5739 6.39502C14.6476 6.54243 14.858 6.54243 14.9317 6.39502L15.723 4.81241C15.7423 4.77371 15.7737 4.74232 15.8124 4.72297L17.395 3.93167C17.5424 3.85797 17.5424 3.64761 17.395 3.5739L15.8124 2.7826C15.7737 2.76325 15.7423 2.73186 15.723 2.69316L14.9317 1.11056C14.858 0.963147 14.6476 0.963148 14.5739 1.11056Z" fill="#ffffff"/> <path d="M19.2419 5.07223L18.4633 7.40815C18.4434 7.46787 18.3965 7.51474 18.3368 7.53464L16.0009 8.31328C15.8185 8.37406 15.8185 8.63198 16.0009 8.69276L18.3368 9.4714C18.3965 9.4913 18.4434 9.53817 18.4633 9.59789L19.2419 11.9338C19.3027 12.1161 19.5606 12.1161 19.6214 11.9338L20.4 9.59789C20.42 9.53817 20.4668 9.4913 20.5265 9.4714L22.8625 8.69276C23.0448 8.63198 23.0448 8.37406 22.8625 8.31328L20.5265 7.53464C20.4668 7.51474 20.42 7.46787 20.4 7.40815L19.6214 5.07223C19.5606 4.88989 19.3027 4.88989 19.2419 5.07223Z" fill="#ffffff"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4075 13.6642C13.2348 16.4915 17.6517 16.7363 20.6641 14.3703C20.7014 14.341 20.7385 14.3113 20.7754 14.2812C20.9148 14.1674 21.051 14.0479 21.1837 13.9226C21.2376 13.8718 21.2909 13.8201 21.3436 13.7674C21.8557 13.2552 22.9064 13.5578 22.7517 14.2653C22.6983 14.5098 22.6365 14.7517 22.5667 14.9905C22.5253 15.1321 22.4811 15.2727 22.4341 15.4122C22.4213 15.4502 22.4082 15.4883 22.395 15.5262C20.8977 19.8142 16.7886 23.0003 12 23.0003C5.92487 23.0003 1 18.0754 1 12.0003C1 7.13315 4.29086 2.98258 8.66889 1.54252L8.72248 1.52504C8.8185 1.49401 8.91503 1.46428 9.01205 1.43587C9.26959 1.36046 9.5306 1.29438 9.79466 1.23801C10.5379 1.07934 10.8418 2.19074 10.3043 2.72815C10.251 2.78147 10.1987 2.83539 10.1473 2.88989C10.0456 2.99777 9.94766 3.10794 9.8535 3.22023C9.83286 3.24485 9.8124 3.26957 9.79212 3.29439C7.32966 6.30844 7.54457 10.8012 10.4075 13.6642ZM8.99331 15.0784C11.7248 17.8099 15.6724 18.6299 19.0872 17.4693C17.4281 19.6024 14.85 21.0003 12 21.0003C7.02944 21.0003 3 16.9709 3 12.0003C3 9.09163 4.45653 6.47161 6.66058 4.81846C5.41569 8.27071 6.2174 12.  3025 8.99331 15.0784Z" fill="#ffffff"/> </g>
            </svg>
                Dark
              </div>
            </div>
        </div>
    </div>
  </nav>
</template>

<style scoped>

  .theme-icons {
    width: 1.2rem;
    height: 1.2rem;
    margin-right:.5rem;
  }
  .theme-changer {
    position: relative;
    left:50%;
    width: 10rem;
    height: 50%;
    display: flex;
    background-color:rgba(155,155,155,.3);
    border-radius: 40px;
    cursor: pointer;
  }

  .theme-options {
    position: absolute;
    top:100%;
    right:90%;
    display: flex;
    flex-direction: column;
    width: 120%;
    background-color: var(--light-grey);
    border-radius: 20px;
    z-index: 100;
    transition: all .2s;
  }

  .theme-options > * {
    padding-left: 20px;
  }

  .theme-icon {
    width: 20% !important;
  }

  .theme-option {
    position: relative;
    display: flex;
    min-height: 2rem;
    align-items: center;
    transition: all .2s;
  }

  .theme-option:nth-child(1) {
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  .theme-option:nth-child(2) {
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }

  .theme-option:hover {
    background-color: var(--light-grey-half);
  }


  .navigation {
    position: relative;
    width: 100%;
    height:100%;
    background:var(--nav-bg);
    display: flex;
    align-items: center;
  }

  .day-icon {
    background-image: url('/day.svg');
  }

  .night-icon {
    background-image: url('/night.svg');
  }

  .search-icon {
    width:100%;
    height:100%;
    background-position: center center;
    background-size: 50%;
  }

  .bubble {
    display: flex;
    overflow: hidden;
  }

  .bubble::after {
    content: '';
    position: absolute;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    background-color:var(--secondary-color);
    opacity: .2;
    animation: bubble-pop .4s ease-out forwards;
  }

  .nav-container {
    padding-left: 2rem;
  }

  .search-section {
    position: relative;
    left:30%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .search-input {
     width: 40rem;
     height: 60%;
     border-top-left-radius:30px;
     border-bottom-left-radius:30px;
     padding-left: 1rem;
     border-left: .1rem solid rgb(155,155,155);
  }

  .search-button {
    position: relative;
    height: 60%;
    width:3.5rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:var(--night-color);
    border-top-right-radius:30px;
    border-bottom-right-radius:30px;
    overflow: hidden;
  }

  .burger-menu {
    position: relative;
    width: 4rem;
    height:60%;
    display: flex;
    align-items: center;
    justify-content: center;
    grid-template-rows: repeat(3,4px);
    row-gap: .5rem;
    border-radius: 10px;
    background-color:var(--night-color);
    flex-direction: column;
    cursor: pointer;
    overflow: hidden;
  }

  .close-burger {
    display:flex;
  }

  .close-burger .burger-line:nth-child(2) {
    display: none;
  }

  .close-burger .burger-line:nth-child(1) {
    top:.3rem;
    transform: rotate(45deg);
  }

  .close-burger .burger-line:nth-child(3) {
    top:-.4rem;
    transform: rotate(-45deg);
  }

  .burger-line {
    position: relative;
    width: 80%;
    min-height: .2rem;
    background-color: var(--secondary-color);
    border-radius:20px;
    z-index: 1;
    pointer-events: none;
    transition: all .2s;
  }

  @keyframes bubble-pop {
    0% {
        transform: scale(0);
        opacity: 0.4;
    }
    70% {
        transform: scale(2);
        opacity: 0.2;
    }
    100% {
        transform: scale(3);
        opacity: 0;
        border-radius: inherit;
    }
  }
</style>

