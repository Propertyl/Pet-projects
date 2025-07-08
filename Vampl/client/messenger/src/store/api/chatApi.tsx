import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import defaultGetQuery from "../../components/global-functions/defaultGetQuery";
import { queryArgs } from "../../components/types/global";

export const chatApi:any = createApi({
  reducerPath:'chat-reducer',
  baseQuery:fetchBaseQuery({
    baseUrl:'http://localhost:3000/chat/',
    credentials:'include'
  }),
  endpoints:(build) => ({
    getChatData:build.query({
      query:defaultGetQuery
    }),
    setNewChat:build.mutation({
      query:({url,param}:queryArgs) => ({
        url:'create-chat',
        method:'POST',
        body:param
      })
    })
  })
});

export const {useGetChatDataQuery} = chatApi;