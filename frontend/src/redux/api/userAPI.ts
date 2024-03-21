import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const userAPI = createApi({
    reducerPath: "userApi",
    replacebaseQuery : fetchBaseQuery({basiUrl : "sad"}),
    endpoints: 
    
})