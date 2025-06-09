import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import defaultGetQuery from "../../components/functions/defaultGetQuery";

export const dataApi:any = createApi({
  reducerPath:'data-reducer',
  baseQuery:fetchBaseQuery({
    baseUrl:'http://localhost:3000/getData/',
    credentials:'include'
  }),
  endpoints:(build) => ({
      getBurgerData:build.query({
        query:defaultGetQuery
      }),
      updateAvatarData:build.mutation({
        query:(avatarData:FormData) => ({
          url:'user-avatar',
          method:'PUT',
          body:avatarData
        })
      }),
  })
});

export const {useGetBurgerDataQuery,useUpdateAvatarDataMutation} = dataApi;

