import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'

createApp(App)
.use(createPinia())
.use(router)
.use(createHead())
.mount('#app');
