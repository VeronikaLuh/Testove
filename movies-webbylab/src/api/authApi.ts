import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { UserLogin, UserRegister, UserModel } from '../models/UserModel.ts/UserModel';

export interface AuthResponse {
  token: string;
  status: number;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/v1/',
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, UserLogin>({
      query: (credentials) => ({
        url: 'sessions',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse, UserRegister>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

