import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllProductResponse,
  CategoriesResponse,
  MessageResponse,
  NewProductRequest,
  SearchProductRequest,
  SearchProductResponse,
} from "../../types/apiTypes";

export const productAPI = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    allProducts: builder.query<AllProductResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["product"],
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => `categories`,
      providesTags: ["product"],
    }),
    searchProducts: builder.query<SearchProductResponse, SearchProductRequest>({
      query: ({ price, page, category, search, sort }) => {
        let baseQuery = `all?search=${search}&page=${page}`;

        if (price) baseQuery += `&price=${price}`;
        if (sort) baseQuery += `&sort=${sort}`;
        if (category) baseQuery += `&category=${category}`;

        return baseQuery;
      },
      providesTags: ["product"],
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ id, formData }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
} = productAPI;
