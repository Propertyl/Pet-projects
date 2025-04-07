<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, toRaw, watch, type Ref } from 'vue';
import useUserData from '../../store/userData';
import triggerEffect from '../functions/bubbleEffect';
import { Socket,io } from 'socket.io-client';
import getLastMessage from '../functions/getLastChatMessage';
import parseMessageTime from '../functions/parseMessageTime';
import setObserver from '../functions/groupObserver';
import parseDate from '../functions/parseDate';
import parseToDeleteGroup from '../functions/parseChatGroups';
import chatAfterRefresh from '../functions/getChatAfterRefresh';
import type { chatData, DefaultRef, statusInfo} from '../../types/global';
import useThrottle from '../functions/useThrottle';

  const chatData:Ref<chatData | null> = ref(null);
  const messagesRef:DefaultRef = ref(null);
  const userData = useUserData();
  const socket:Socket = io('http://localhost:3000/app');
  const currentMessage:Ref<string,string> = ref('');
  const currentRoom:Ref<string,string> = ref('');
  const userName:Ref<string> = ref('');
  const downButton:Ref<boolean> = ref(false);

  const searchScroll = () => {
      if(messagesRef.value) {
        const chatScroll = messagesRef.value;
        const currentHeight = chatScroll.scrollTop;

        if((chatScroll.scrollHeight - currentHeight) > 1080) {
           downButton.value = true;
        } else {
          if(downButton.value === true) {
             downButton.value = false;
          }
        }
      }
  }

  const throttle = useThrottle(searchScroll,200);

  onMounted(async () => {
    socket.on('connect',async () => {
      console.log('changed ur status');
    });

    socket.on('user-updates',(info:statusInfo) => {
      userData.setChangedUser(info);
    });

    socket.on('updateChat',(currentChat:any) => {
      chatData.value = parseToDeleteGroup(currentChat['all']);
      const newChats = userData.allChats.map(chat => {
        if(chat.id === currentRoom.value) {
          const currentLast = getLastMessage(currentChat);
          chat = {id:chat.id,...currentLast};
        }

        return chat;
      });

      userData.setAllChatsIp(newChats);
       
    });

  });

  onUnmounted(() => {
    messagesRef.value!.removeEventListener('scroll',throttle);
  });

  watch(userData,async () => {
    if(Object.keys(userData.additionalData).length) {
      userName.value = userData.additionalData.name;
    }

    if(userData.ip) {
      await chatAfterRefresh(userData);
    }
  });

  watch(chatData,async () => {
     await nextTick();
     if(messagesRef.value) {
      messagesRef.value.addEventListener('scroll',throttle);
      scrollDown();
     }
  });

  const scrollDown = () => {
    if(messagesRef.value) {
      messagesRef.value.scrollTo({top:messagesRef.value.scrollHeight});
      downButton.value = false;
     }
  }

  const sendMessageToChat = () => {
    if(currentMessage.value.length) {
      const time = new Date();
      socket.emit('sendMessage',{room:currentRoom.value,message:{user:userName.value,body:currentMessage.value,time:time.toLocaleString()}});
      currentMessage.value = "";
      messagesRef.value!.scrollTo({top:messagesRef.value!.scrollHeight,behavior:'smooth'});
    }
  }

  const startSending = (event:any,type:"input" | "button") => {
      if(type === "input" && event.key === "Enter") {
        triggerEffect(event);
        sendMessageToChat();
        return;
      } else if(type === "button") {
        triggerEffect(event);
        sendMessageToChat();
      }
  }

  const connectObserver = () => {
    const groups = document.querySelectorAll('.group-container');
    setObserver(groups,{threshold:.5});
  }

  watch(() => userData.allChats,() => {
      if(userData.allChats.length) {
        userData.allChats.forEach(room => {
          socket.emit('joinRoom',room.id);
        });
      }
  });

  watch(() => userData.currentChat,() => {
     if(Object.keys(userData.currentChat).length && !chatData.value) {
        console.log('pipiska',userData.currentChat);
        chatData.value = parseToDeleteGroup(userData.currentChat.messages['all']);
        console.log('opened chat:',toRaw(chatData.value));
        currentRoom.value = userData.currentChat.id;
        nextTick(connectObserver);
     }
  },{deep:true});
</script>

<template>
  <div class="chat">
    <div v-if="chatData" class="messages-container">
       <button class="classic-button down-button" @click="scrollDown" v-if="downButton === true">
        <i class="arrow-icon icon"></i>
       </button>
       <div ref="messagesRef" class="messages">
         <div class="messages-group-container">
            <div class="container container-reverse group-container" v-for="(date,_) in chatData">
              <span class="date-container">
                <p class="group-date">{{ parseDate(Object.keys(date).pop())}}</p>
              </span>
              <div class="message-group" v-for="({body},_) in Object.values(date).pop()!.groups" :class="{'group-right':body.sender === userName}">
              <div class="message" :class="{'not-user-message':body.sender !== userName}" v-for="(message,index) in body.messages" :key="`message-${body}-${index}`">
                <svg v-if="index === body.messages.length -1" viewBox="0 0 30 30" width="30" height="30" class="message-tail chat-message-tail" >
                  <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31"  />
                </svg>
                 <p class="message-body">{{ message.body }}</p>
                 <p class="message-time">{{ parseMessageTime(message.time) }}</p>
              </div>
          </div>
            </div>
         </div>
       </div>
       <div class="messages-input">
          <div class="type-message-container">
            <input v-on:keypress="(event) => startSending(event,'input')" v-model="currentMessage" placeholder="Message" class="message-input" type="text">
            <svg viewBox="0 0 30 30" width="30" height="30" class="message-tail">
              <path xmlns="http://www.w3.org/2000/svg" id="Vector 1" d="M1 1C4.68182 6.06135 15.8364 16 31 15.2638C20.1818 17.5474 1 27.0736 2.96364 31" />
            </svg>
          </div>
          <button @click="(event) => startSending(event,'button')" class="classic-button messages-button">
            <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" fill="none" stroke="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
            <g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </g>
            </svg>
          </button>
       </div>
    </div>
  </div>
</template>

<style scoped>

  .send-icon {
    pointer-events: none;
  }

  .down-button {
    position: absolute !important;
    bottom:10%;
    left:5%;
    width: 3.5rem;
    height: 3.5rem;
    clip-path: circle();
    background-color: var(--light-grey);
    z-index: 10000;
    color:var(--secondary-color);
  }

  .arrow-icon {
    background: url('/down-arrow.png');
    background-size: 90% 90%;
    background-position: center;
  }

  .date-container {
    position: sticky; 
    top: .4rem;
    width: 5rem;
    height: 2rem;
    padding: .2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin: .3rem;
    z-index: 1;
    user-select: none;
  }

  .date-container::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background-color:var(--night-tilelight);
    opacity: .8;
    backdrop-filter: blur(.2rem);
    z-index: 0;
  }

  .group-date {
    font-weight: var(--message-weight);
    color: var(--secondary-color);
    z-index: 1;
  }


  .chat {
    position: relative;
    width: calc(100% - 10rem);
    display: flex;
    justify-content: center;
    height:100%;
    background-color:var(--chat-bg-color);
  }


  .group-right  {
    margin-left: auto;
    margin-right: 0 !important;
    transform: scaleX(1) !important;
  }


  .not-user-message {
    background-color: var(--light-grey) !important;
  }

  .not-user-message .message-body {
    transform: scaleX(-1);
  }

  .not-user-message .message-time {
    transform:scaleX(-1);
  }

  .not-user-message .message-tail {
      fill: var(--light-grey) !important;
    }

  .message-group {
    position: relative;
    display:flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    width: 100%;
    margin-right: auto;
    transform: scaleX(-1);
  }
  
  .message-time {
    position: relative;
    display: flex;
    font-size: .7rem;
    color: var(--message-color);
    font-weight: 500;
    align-self: flex-end;
    justify-self:flex-end;
    margin: .1rem .5rem 0 0;
    z-index: 1;
  }
  
  .message {
    position: relative;
    display:flex;
    max-width: 70%;
    padding-left:20px;
    padding-right: .2rem;
    flex-direction: column;
    border-radius:10px;
    border-top-left-radius:50px;
    border-bottom-left-radius:50px;
    background-color: var(--night-color);
    margin: .2rem;
    text-wrap: wrap; 
    white-space: normal; 
  }

  .chat-message-tail {
    bottom:.2rem !important;
    right:-.5rem !important;
    width: 1rem !important;
    height:1rem !important;
    transform: rotate(20deg);
    z-index: 0;
  }

  .message-tail {
    position: absolute;
    right: -.8rem;
    bottom: 0rem;
    width: 2rem;
    height: 2rem;
    fill: var(--night-color);
  }

  .messages-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content:flex-start;
    align-items: center;
    width: 100%;
    max-height: 100%;
    padding-bottom:1rem ;
  }

  .type-message-container {
    position: relative;
    width: 80%;
    height: 4rem;
    display: flex;
  }

  .message-body {
    position: relative;
    display: flex;
    color:var(--message-color);
    font-weight:var(--message-weight);
    margin: 0;
    max-width:95%;
    white-space: normal; /* Разрешаем перенос слов */
    word-wrap: break-word; /* Слова переносятся, когда упираются в границу */
    max-width: 100%; /* Ширина сообщения внутри границ */
    word-break: break-word; /* Разрешает разрыв длинных слов */
  }

  .message-input {
    width:100%;
    height:100%;
    border-radius:20px;
    font-size:var(--text-size);
    padding-left: 1rem;
  }

  .messages-button {
     border-radius: 50%;
     width: 3.5rem;
     height: 3.5rem;
     background-color: var(--night-color);
     margin: 1rem;
     clip-path: circle(3rem);
  }

  .message-icon {
    background-image: url('/send.png');
    background-repeat: no-repeat;
  }

  .messages-group-container {
     position: relative;
     width:50%;
     min-height: 100%;
     display: flex;
     flex-direction: column;
  }

  .messages {
    position: relative;
    width:100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    height:90%;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-color:var(--scrollbar-color);
    scrollbar-width:thin;
    transition: all .2s;
    
  }


  .message::-webkit-scrollbar-button {
    display: none !important;
  }

  .type-message-container .message-tail {
      fill: var(--input-color) !important;
  }

  .messages-input {
    position: relative;
    display: flex;
    width: 60%;
    height: 10% !important;
    align-items: center;
    justify-content: center;
  }


  @media (prefers-color-scheme: light) {
    .chat > * {
      z-index: 1;
    }
  }
</style>