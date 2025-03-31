import { createWebHistory, createRouter } from "vue-router";
import HomePage from './components/HomePage.vue';
import AuthPage from "./components/AuthPage.vue";

const routes:{path:string,component:any}[] = [
  {path:'/', component:HomePage},
  {path:'/auth', component:AuthPage}
];

const router = createRouter({
  history:createWebHistory(),
  routes
});

export default router;