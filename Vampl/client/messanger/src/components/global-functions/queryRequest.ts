import { Dispatch } from "@reduxjs/toolkit";
import { someApi } from "../../store/api/baseApi";
import { queryArgs } from "../types/global";

const queryRequest = async (api:someApi,query:keyof someApi,args:queryArgs,dispatch:Dispatch) => {
  const res = await dispatch(api.endpoints[query].initiate(args)).unwrap();

  return res;
}

export default queryRequest;