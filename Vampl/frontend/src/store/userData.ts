import { defineStore } from "pinia";
import type { ParsedChat, UserData } from "../types/global";

const useUserData = defineStore('user',{
  state:():UserData => ({
    ip:"",
    locale:"",
    currentChat:{},
    additionalData:{},
    allChats:[],
    allMonth:{},
    changedUser:{}
  }),

  actions: {
    setChangedUser(user:any) {
       this.changedUser = user;
    },

    setIp(value:string) {
      this.ip = value
    },
    setChat(value:ParsedChat) {
      this.currentChat = value;
    },
    setAllChatsIp(chatsData:{id:string,last:string,time:string}[]) {
      this.allChats = chatsData;
    },
    setAdditionalData(data:any) {
      this.additionalData = data;
    },
    setMonth(months:any) {
      this.allMonth = months;
    },
    setLocale(userLocale:string) {
      this.locale = userLocale;
    }
  }
});

export default useUserData;