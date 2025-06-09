import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserInfo } from "../../types/global";
import defaultGetQuery from "../../components/functions/defaultGetQuery";

// type QueryURL<T extends string> = T extends `/${string}` ? false : true;

// type CurrentURL<T extends string> = QueryURL<T>;


export const userApi:any = createApi({
  reducerPath:'reducerUser',
  baseQuery:fetchBaseQuery({
    baseUrl:'http://localhost:3000/user/',
    credentials:'include'
  }),
  endpoints:(build) => ({
    getInfoByName:build.query({
      query:(name:string) => `infoByName/${name}`,
    }),
    updateUserInfo:build.mutation({
      query:(data:UserInfo) => ({
        url:'update-info',
        method:'PUT',
        body:data
      }),
    }),
    getUserConvenientData:build.query({
      query:defaultGetQuery
    })
  })
});

export const {useGetInfoByNameQuery,useLazyGetInfoByNameQuery,useUpdateUserInfoMutation,useGetUserConvenientDataQuery} = userApi;