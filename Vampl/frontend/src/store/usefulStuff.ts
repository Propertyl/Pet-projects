import { defineStore } from "pinia";


const useUsefulStuff = defineStore('stuff',{
  state:() => ({
    burgerOpen:false
  }),

  actions:{
    switchBurger() {
      return this.burgerOpen = !this.burgerOpen;    
    }
  }
})

export default useUsefulStuff;