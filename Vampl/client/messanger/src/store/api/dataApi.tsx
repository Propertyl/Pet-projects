import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import defaultGetQuery from "../../components/global-functions/defaultGetQuery";
import { queryArgs } from "../../components/types/global";

export const dataApi:any = createApi({
  reducerPath:'data-reducer',
  baseQuery:fetchBaseQuery({
    baseUrl:'http://localhost:3000/getData/',
    credentials:'include'
  }),
  endpoints:(build) => ({
      getSomeData:build.query({
        query:defaultGetQuery
      }),
      updateAvatarData:build.mutation({
        query:(avatarData:FormData) => ({
          url:'user-avatar',
          method:'PUT',
          body:avatarData
        })
      }),
      getPageText:build.query({
        query:({url,param}:queryArgs) => `${url}/${param[0]}/${param[1]}`
      })
  })
});

export const {useGetSomeDataQuery,useUpdateAvatarDataMutation,useGetPageTextQuery} = dataApi;

