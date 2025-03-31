<script setup lang="ts">
import useUsefulStuff from '../../store/usefulStuff';
import triggerEffect from '../functions/bubbleEffect';
const usefulStuff = useUsefulStuff();



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
    </div>
  </nav>
</template>

<style scoped>
  .navigation {
    position: relative;
    width: 100%;
    height:100%;
    background:var(--bg-main);
    display: flex;
    align-items: center;
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

