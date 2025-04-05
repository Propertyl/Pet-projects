<script setup lang="ts">
import { ref, watch, type Ref} from 'vue';
import useUserData from '../../store/userData';
import triggerEffect from '../functions/bubbleEffect';
import checkActiveChat from '../functions/checkActiveChat';
import type {ParsedChat} from '../../types/global';
import parseMessageTime from '../functions/parseMessageTime';
import getUserChats from '../functions/getUserChats';
import UserBurger from './UserBurger.vue';
import useUsefulStuff from '../../store/usefulStuff';
import { convertStatus } from '../functions/convertStatus';
import serv from '../functions/interceptors';

const chats:Ref<ParsedChat[]> = ref([]);
const userData = useUserData();
const contactDefatult:Ref<Boolean> = ref(true);
const activeChat:Ref<string> = ref("");
const currentHref:Ref<string> = ref("");
const usefulStuff = useUsefulStuff();

watch(() => userData.currentChat,() => {
  currentHref.value = window.location.href;
  activeChat.value = userData.currentChat.user.name ;
});

watch(() => userData.changedUser,() => {
   if(chats.value) {
      const {ip,status} = userData.changedUser;

      for(let chat of chats.value) {
        if(chat.user.ip === ip) {
          chat.user.status = convertStatus(status);
        }
      }
   }
});

watch(userData,async () => {
  if(userData.ip && !chats.value.length) {
    chats.value = await getUserChats(userData);;
  }
});

const parseLast = (id:string) => {
  return userData.allChats.find(chat => chat.id === id);
}

const openChat = async (contact:ParsedChat) => {
  const contactChat:any = await serv.get(`/chat/chatID/${contact.id}`);

  contact.messages = contactChat.messages;
  userData.setChat(contact);
}
</script>

<template>
  <section class="contact-tape" :class="{default:!contactDefatult}">
    <UserBurger v-if="usefulStuff.burgerOpen" :isOpen="usefulStuff.burgerOpen"/>
    <div v-else style="padding-top: .2rem;" class="container flex-reverse">
        <a draggable="false" v-if="chats.length" :class="{shortContact:!contactDefatult,'contact-chat-active':activeChat == contact.user.name}" class="contact-container" v-for="(contact,index) in chats" :href="`#@${contact.user.name}`" :key="`contact-${index}`">
        <div @click="(event:any) => {
        triggerEffect(event);
        checkActiveChat(currentHref,contact.user.name) && openChat(contact);
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
          <div v-else class="contact-loading-container flex-center">
            <svg class="contact-line-loading" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none">
            <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612"  stroke-width="3.55556" stroke-linecap="round"/>
            </svg>
          </div>
    </div>
  </section>
</template>

<style scoped>

  .contact-line-loading {
    position: relative;
    width: 50%;
    height: 50%;
    stroke: var(--night-color);
    animation: spinning 1s ease-in-out infinite;
  }

  .contact-loading-container {
    position:absolute;
    top:40%;
    width: 100%;
    height:10rem;
    display: flex;
  }

  .contact-tape {
    position: relative;
    width:30rem;
    height: 100%;
    background-color:var(--bg-main);
    transition: all .2s;
    cursor: pointer;
    display: flex;
    padding-top: .5rem;
  }

  .status-picture-container {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .contact-status {
    position: absolute;
    bottom:15%;
    right:10%;
    width:1rem;
    height:1rem;
    border-radius: 50%;
    border:.2rem solid var(--light-black);
    clip-path: circle();
    z-index: 1;
  }

  .online {
    background-color:var(--night-color);
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

  .contact-chat-active {
    background-color: var(--night-color) !important;
  }

  .contact-chat-active .online {
    background-color: var(--secondary-color);
    border-color: var(--night-color);
  }

  .shortContact .with-padding {
    padding-left:0;
  }
  .contact-chat-active .contact-name {
    color:var(--secondary-color);
  }

  .contact-chat-active .contact-chat-last-message {
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
    margin: .2rem 0;
  }

  .contact-container * {
     transition: all .3s;
  }

  .contact-container:hover {
    background-color: var(--night-color);
  }

  .contact-container:hover .online {
    background-color: var(--secondary-color);
    border-color: var(--night-color);
  }

  .contact-container:hover .contact-chat-last-message {
    color:var(--secondary-color);
  }


  .contact-info-container {
    height: 100%;
    display: flex;
    flex-grow: 1;
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


  @keyframes spinning {
    to {
      transform: rotate(360deg);
    }
  }
</style>