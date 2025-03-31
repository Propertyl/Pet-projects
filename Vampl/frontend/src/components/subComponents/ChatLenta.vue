<script setup lang="ts">
import { ref, watch} from 'vue';
import useUserData from '../../store/userData';
import triggerEffect from '../functions/bubbleEffect';
import checkActiveChat from '../functions/checkActiveChat';
import type { Chat} from '../../types/global';
import parseMessageTime from '../functions/parseMessageTime';
import getUserChats from '../functions/getUserChats';
import UserBurger from './UserBurger.vue';
import useUsefulStuff from '../../store/usefulStuff';

const chats:any = ref([]);
const userData = useUserData();
const contactDefatult = ref(true);
const activeChat = ref("");
const currentHref = ref("");
const usefulStuff = useUsefulStuff();

watch(() => userData.currentChat,() => {
  currentHref.value = window.location.href;
  activeChat.value = userData.currentChat.user.name ;
});

watch(userData,async () => {
  if(userData.ip && !chats.value.length) {
    chats.value = await getUserChats(userData);
  }
});

const parseLast = (id:string) => {
  return userData.allChats.find(chat => chat.id === id);
}

const openChat = ({name,image,chat,id}:Chat) => {
  userData.setChat({user:{name,image},messages:chat,id:id});
}
</script>

<template>
  <section class="contact-tape" :class="{default:!contactDefatult}">
    <UserBurger v-if="usefulStuff.burgerOpen" :isOpen="usefulStuff.burgerOpen"/>
    <div v-else style="justify-content: center;padding-top: .2rem;" class="container">
        <a draggable="false" v-if="chats.length" :class="{shortContact:!contactDefatult,'chat-active':activeChat == contact.user.name}" class="contact-container" v-for="(contact,index) in chats" :href="`#@${contact.user.name}`" :key="`contact-${index}`">
        <div @click="(event:any) => {
        triggerEffect(event);
        checkActiveChat(currentHref,contact.user.name) && openChat({name:contact.user.name,image:contact.user.image,chat:contact.messages,id:contact.id});
      }" class="container with-padding hidden-container">
          <div class="status-picture-container">
            <img class="contact-image" :src="contact.user.image" alt="">
            <span :class="{'online':contact.user.status === 'Online','offline':contact.user.status === 'Offline'}" class="contact-status" ></span>
          </div>
          <div class="contact-info-container">
          <p  class="contact-name">{{ contact.user.name }}</p>
          <p class="contact-chat-last-message">{{parseLast(contact.id)?.last}}</p>
          <p class="contact-chat-message-time">{{ parseMessageTime(parseLast(contact.id)?.time ?? "") }}</p>
          </div>
        </div>
        </a>
        <div v-else>
          <span class="loading-dot">.</span>
          <span class="loading-dot">.</span>
          <span class="loading-dot">.</span>
        </div>
    </div>
  </section>
</template>

<style scoped>
  .contact-tape {
    position: relative;
    width:30rem;
    height: 100%;
    background-color:var(--bg-main);
    transition: all .2s;
    cursor: pointer;
    display: flex;
  }

  .status-picture-container {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .contact-status {
    position: absolute;
    bottom:15%;
    right:12%;
    width:.8rem;
    height:.8rem;
    border-radius: 50%;
    border:.1rem solid var(--black-default);
    clip-path: circle();
    z-index: 1;
  }

  .online {
    background-color: greenyellow;
  }

  .offline {
    display: none;
  }

  .with-padding {
    padding-left: 1rem;
  }

  .default {
    background: var(--secondary-color);
    width: 10rem;
  }

  .contact-bubble {
    display: flex;
  }

  .chat-active {
    background-color: var(--night-color) !important;
  }

  .shortContact .with-padding {
    padding-left:0;
  }
  .chat-active .contact-name {
    color:var(--secondary-color);
  }

  .chat-active .contact-chat-last-message {
    color:var(--secondary-color);
  }

  .contact-bubble .contact-container {
    overflow: hidden;
  }

  .contact-bubble::after {
    content: '';
    position: absolute;
    top:30%;
    left:30%;
    width: 10rem;
    height: 10rem;
    display: flex;
    border-radius: 50%;
    background-color:var(--bubble-color);
    transform-origin: center;
    z-index: 0;
    animation: bubble-pop .3s ease-out;
  }


  .contact-name {
    font-size: 1.5rem;
    color:var(--secondary-color);
  }

  .contact-chat-last-message {
    font-size: .9rem;
    color:var(--black-default);
    width: 80%;
    overflow: hidden;
    max-height: 50%;
  }

  .contact-chat-message-time {
    position: absolute;
    top:2%;
    right:2%;
    font-size: .7rem;
    color:var(--secondary-color);
  }

  .contact-container {
    position: relative;
    width: 95%;
    height: 7rem;
    display: flex;
    align-items: center;
    user-select: none;
    border-radius: 10px;
    transition: all .3s;
    background: var(--main-grey);
  }

  .contact-container * {
     transition: all .3s;
  }

  .contact-container:hover {
    background-color: var(--night-color);
  }

  .contact-container:hover .contact-chat-last-message {
    color:var(--secondary-color);
  }


  .contact-info-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    font-size: 1rem;
    text-wrap: nowrap;
    z-index: 1;
    pointer-events: none;
  }

  .contact-info-container p {
    margin: .1rem;
  }

  .contact-image {
    width: 5.5rem;
    height: 80%;
    z-index: 1;
  }

  .shortContact {
    flex-direction:  column;
    align-items: center;
    justify-content: center; 
    border-radius: 10%;
  }

  .shortContact .container {
    justify-content: center;
    transition: all .2s;
  }

  .shortContact .contact-info-container {
    display: none;
  }
</style>