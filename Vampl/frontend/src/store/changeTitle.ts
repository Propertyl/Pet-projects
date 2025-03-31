import { defineStore } from "pinia";



const useChangeTitle = defineStore('title',{
  state:() => (
    {
      currentTitle:""
    }
  ),

  actions:{
    changeTitle(newTitle:string) {
      this.currentTitle = newTitle;
    }
  }
})

export default useChangeTitle;