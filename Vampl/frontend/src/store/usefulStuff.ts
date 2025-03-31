import { defineStore } from "pinia";


const useUsefulStuff = defineStore('stuff',{
  state:() => ({
    burgerOpen:false
  }),

  actions:{
    switchBurger() {
      if(this.burgerOpen) {
        this.burgerOpen = false;
        return;
      }

      this.burgerOpen = true;
    }
  }
})

export default useUsefulStuff;