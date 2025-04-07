
<script setup lang="ts">
import { onMounted} from 'vue';
import useUserData from './store/userData';
import type { UserInfo } from './types/global';
import { useRouter } from 'vue-router';
import changeTheme from './components/functions/changeTheme';
import serv from './components/functions/interceptors';

let userData = useUserData();
const router = useRouter();

onMounted(async () => {
    
    // const user = window.location.href.split('#').pop();
    const authInfo:UserInfo = await serv.get(`/user/getAuthData/${false}`);
    const currentTheme:{theme:string} = await serv.get(`/user/get-theme/${authInfo.ip}`);

    changeTheme(currentTheme.theme);
    const months = await serv.get('/getData/month/en');
   
    userData.setMonth(months);
    userData.setIp(authInfo.ip);
    userData.setLocale(navigator.language);
        
    if(!authInfo.authorized) {
      router.push('/auth');
      return;
    }

    const userInfo = await serv.get(`/user/infoByIp/${authInfo.ip}`);

    userData.setAdditionalData(userInfo);
 })
</script>

<template>
  <RouterView/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.moved-back {
  position: absolute;
  bottom:0;
  left:0;
  width: 100vw;
  background-color: rgba(12, 12, 12, 0.5);
  transition: all .2s;
  z-index: -1000;
}
</style>
