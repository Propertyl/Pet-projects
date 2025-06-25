import { Dispatch } from "@reduxjs/toolkit";
import { UserData } from "../types/global";
import queryRequest from "./queryRequest";
import { userApi } from "../../store/api/baseApi";

const getUserPhone = async (dispatch:Dispatch) => {
  const {phone}:UserData = await queryRequest(userApi,'getUserConvenientData',{url:'info'},dispatch) as UserData;
  return phone;
}

export default getUserPhone;