import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  burgerOpen:false
}

const useUsefulStuff = createSlice({
  name:'stuff',
  initialState,
  reducers:{
    switchBurger(state) {state.burgerOpen = !state.burgerOpen }
  }

});

export const {switchBurger} = useUsefulStuff.actions;

export default useUsefulStuff.reducer;