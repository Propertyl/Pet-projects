import { createSlice } from "@reduxjs/toolkit"
import { MessagesData } from "../types/global";


const initialState = {
  deleteArgs:{date:"",group:"",room:"",body:"",time:""},
} satisfies {
  deleteArgs:MessagesData,
}

const chatReducer = createSlice({
  name:"chatReducer",
  initialState,
  reducers: {
     setDeleteFunc(state,action) {state.deleteArgs = action.payload},
  }
});


export const {setDeleteFunc} = chatReducer.actions;

export default chatReducer.reducer;