import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  burgerOpen:false,
  userInBurger:"",
  title:"Vampl",
  currentRoom:""
}

const useUsefulStuff = createSlice({
  name:'stuff',
  initialState,
  reducers:{
    switchBurger(state) {state.burgerOpen = !state.burgerOpen },
    changeTitle(state,action) { state.title = action.payload },
    changeRoom(state,action) {state.currentRoom = action.payload},
    switchUser(state,action) {state.userInBurger = action.payload}
  }

});

export const {switchBurger,changeTitle,changeRoom,switchUser} = useUsefulStuff.actions;

export default useUsefulStuff.reducer;