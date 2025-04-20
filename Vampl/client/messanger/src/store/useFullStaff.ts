import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  burgerOpen:false,
  userInBurger:"",
  title:"Vampl",
  currentRoom:"",
  approve:false
}

const useUsefulStuff = createSlice({
  name:'stuff',
  initialState,
  reducers:{
    switchBurger(state) {state.burgerOpen = !state.burgerOpen },
    changeTitle(state,action) { state.title = action.payload },
    changeRoom(state,action) {state.currentRoom = action.payload},
    switchUser(state,action) {state.userInBurger = action.payload},
    switchAccess(state,action) {
      console.log("SET ACCESS:", action.payload);
      state.approve = action.payload;
    }
  }

});

export const {switchBurger,changeTitle,changeRoom,switchUser,switchAccess} = useUsefulStuff.actions;

export default useUsefulStuff.reducer;