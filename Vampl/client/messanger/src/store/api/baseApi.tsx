import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserInfo } from "../../types/global";
import defaultGetQuery from "../../components/global-functions/defaultGetQuery";
import { queryArgs } from "../../components/types/global";

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
    }),
    updateUserTheme:build.mutation({
      query:(data:{theme:string}) => ({
        url:'update-theme',
        method:'PUT',
        body:data
      })
    }),
    createUserData:build.mutation({
      query:({url,param}:queryArgs) => ({
        url:url,
        method:'POST',
        body:param
      })
    }),
    setUserAuthorized:build.mutation({
      query:({url,param}:queryArgs) => ({
        url:'setAuthorized',
        method:'PUT',
        body:param
      })
    }),
    setUserLogOut:build.mutation({
      query:() => ({
        url:'log-out',
        method:'PUT',
        body:{}
      })
    })
  })
});

export type someApi = typeof userApi;

export const {useGetInfoByNameQuery,useLazyGetInfoByNameQuery,useUpdateUserInfoMutation,useGetUserConvenientDataQuery,useLazyGetUserConvenientDataQuery,useUpdateUserThemeMutation,useCreateUserDataMutation} = userApi;