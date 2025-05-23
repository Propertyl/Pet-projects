import { createSlice } from "@reduxjs/toolkit"
import { MessagesData } from "../types/global";


const initialState = {
  deleteArgs:{date:"",group:"",room:"",body:"",time:""},
  unReadMessages:0
} satisfies {
  deleteArgs:MessagesData,
  unReadMessages:number
}

const chatReducer = createSlice({
  name:"chatReducer",
  initialState,
  reducers: {
    setDeleteFunc(state,action) {state.deleteArgs = action.payload},
    incrementMessages(state) {state.unReadMessages += 1}
  }
});


export const {setDeleteFunc,incrementMessages} = chatReducer.actions;

export default chatReducer.reducer;