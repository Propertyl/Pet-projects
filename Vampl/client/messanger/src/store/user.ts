import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../components/types/global";

const initialState = {
  locale:"",
  phone:"",
  currentChat:{},
  additionalData:{},
  allChats:[],
  allMonth:{},
  changedUser:{}
} satisfies UserData as UserData;

const useUserData = createSlice({
  name:'user-data',
  initialState,
  reducers:{
    setData(state,action) {
      const {field,value} = action.payload;
      state[field as keyof UserData] = value;
    }
  }
});

export const {setData} = useUserData.actions;

export default useUserData.reducer;