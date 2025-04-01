<script setup lang="ts">
import { useHead } from '@vueuse/head';
import useChangeTitle from '../store/changeTitle';
import Navigation from './subComponents/Navigation.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import ChatLenta from './subComponents/ChatsMenu.vue';
import Chat from './subComponents/Chat.vue';

const title = useChangeTitle();
const footer:any = ref(false);
title.changeTitle("Main");

useHead({
  title:title.currentTitle
})

// const switchFooter = (Event:WheelEvent) => {
//     if(Event.deltaY > 0 && !footer.value) {
//       footer.value = true;
//     } else if (Event.deltaY < 0 && footer.value) {
//       footer.value = false;
//     }
// }

// onMounted(() => {
//   window.addEventListener('wheel',switchFooter,{passive:true});
// })

// onUnmounted(() => {
//   window.removeEventListener('wheel',switchFooter);
// })

</script>


<template>
  <header :class="{headerUp:footer}">
    <Navigation/>
  </header>
  <main class="chat-main" :class="{mainUp:footer}">
    <ChatLenta/>
    <Chat/>
  </main>
</template>

<style scoped>
  .chat-main {
    position: relative;
    background-color:var(--chat-bg-color);
    width: 100%;
    height: calc(100% - var(--header-height));
    display: flex;
    transition: all .2s;
  }

  .chat-footer {
    position: relative;
    background-color:var(--bg-main);
    height:var(--footer-height);
    transition: all .2s;
  }

  .mainUp {
    transform: translateY(var(--foter-space));
  }

  .headerUp {
    transform: translateY(var(--foter-space));
  }

  .footerUp {
    display: flex;
    transform: translateY(var(--foter-space));
  }


</style>