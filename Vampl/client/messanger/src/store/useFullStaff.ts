import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  burgerOpen:false,
  title:"Vampl"
}

const useUsefulStuff = createSlice({
  name:'stuff',
  initialState,
  reducers:{
    switchBurger(state) {state.burgerOpen = !state.burgerOpen },
    changeTitle(state,action) { state.title = action.payload }
  }

});

export const {switchBurger,changeTitle} = useUsefulStuff.actions;

export default useUsefulStuff.reducer;