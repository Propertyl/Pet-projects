import { createSlice } from "@reduxjs/toolkit"
import { chatStates } from "../components/types/global";



const initialState:chatStates = {
  deleteArgs:{date:"",group:"",room:"",body:"",time:""},
  unReadMessages:{},
  refreshChatsTape:false
} 

const chatReducer = createSlice({
  name:"chatReducer",
  initialState,
  reducers: {
    setDeleteFunc(state,action) {state.deleteArgs = action.payload},
    incrementMessages(state,action) {
      const room = action.payload;
      state.unReadMessages[room] = (state.unReadMessages[room] || 0) + 1;
    },
    decrementMessages(state,action) {
      const room = action.payload;
      if(state.unReadMessages[room]) {
        state.unReadMessages[room] -= 1;
      }
    },
    switchRefreshChatsTape(state,action) {
      state.refreshChatsTape = action.payload;
    }
  }
});


export const {setDeleteFunc,incrementMessages,decrementMessages,switchRefreshChatsTape} = chatReducer.actions;

export default chatReducer.reducer;