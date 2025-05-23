import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  burgerOpen:false,
  userInBurger:"",
  currentRoom:"",
  approve:false
}

const useUsefulStuff = createSlice({
  name:'stuff',
  initialState,
  reducers:{
    switchBurger(state) {state.burgerOpen = !state.burgerOpen },
    changeRoom(state,action) {state.currentRoom = action.payload},
    switchUser(state,action) {state.userInBurger = action.payload},
    switchAccess(state,action) {
      state.approve = action.payload;
    }
  }

});

export const {switchBurger,changeRoom,switchUser,switchAccess} = useUsefulStuff.actions;

export default useUsefulStuff.reducer;