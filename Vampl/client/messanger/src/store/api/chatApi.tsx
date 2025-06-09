import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import defaultGetQuery from "../../components/functions/defaultGetQuery";

export const chatApi = createApi({
  reducerPath:'chat-reducer',
  baseQuery:fetchBaseQuery({
    baseUrl:'http://localhost:3000/chat/',
    credentials:'include'
  }),
  endpoints:(build) => ({
    getChatData:build.query({
      query:defaultGetQuery
    })
  })
});

export const {useGetChatDataQuery} = chatApi;