import { createSlice } from "@reduxjs/toolkit"
import { MessagesData } from "../types/global";


const initialState = {
  deleteArgs:{date:"",group:"",room:"",body:"",time:""},
  deleteChat:""
} satisfies {
  deleteArgs:MessagesData,
  deleteChat:string
}

const chatReducer = createSlice({
  name:"chatReducer",
  initialState,
  reducers: {
     setDeleteFunc(state,action) {state.deleteArgs = action.payload},
     setDeleteChat(state,action) {state.deleteChat = action.payload}
  }
});


export const {setDeleteFunc,setDeleteChat} = chatReducer.actions;

export default chatReducer.reducer;