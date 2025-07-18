import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCookie } from '../helpers/getCookies';
import { ACCESS_TOKEN } from '../constants/cookies';

export interface Movie {
    id?: number;
    title: string;
    year: number;
    format: string;
    actors: string[];
}

export interface MovieResponse {
  data: Movie[];
  meta: {
    total: number;
  };
}

const apiUrl = window._env_?.API_URL || "http://localhost:8000/api/v1/";

export const moviesApi = createApi ({ 
 reducerPath: 'moviesApi',
 baseQuery: fetchBaseQuery({ 
   baseUrl: `${apiUrl}`,
   prepareHeaders: (headers) => {
     headers.set('Authorization', `${getCookie(ACCESS_TOKEN)}`);
     return headers;
   }
 }),
 tagTypes: ['Movie'],
 endpoints: (builder) => ({
   getMovies: builder.query<MovieResponse, { sort?: string; order?: string; limit?: number; offset?: number } | void>({
     query: ({ sort = "year", order = "DESC", limit = 10, offset = 0 } = {}) => `movies?sort=${sort}&order=${order}&limit=${limit}&offset=${offset}`,
     providesTags: ['Movie'],
   }),
   getMovieById: builder.query({
     query: (id) => `movies/${id}`,
     providesTags: ['Movie'],
     
   }),
   
   addMovie: builder.mutation<void, Movie>({
     query: (movie) => ({
    url: 'movies',
    method: 'POST',
    body: movie,
  }),
  invalidatesTags: ['Movie'],
}),
    importMovies: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: '/movies/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Movie'],
    }),
   editMovie: builder.mutation<void, Movie>({
     query: (movie) => ({
         url: `movies/${movie.id}`,
         method: 'PATCH',
         body: movie,
      }),
      invalidatesTags: ['Movie'],
 }),
 getMoviesSearch: builder.query<MovieResponse, { search?: string }>({
  query: ({ search }) =>
    `movies?search=${encodeURIComponent(search || "")}&sort=year&order=DESC&limit=10&offset=0`,
  providesTags: ['Movie'],
}),
    deleteMovie: builder.mutation<void, number>({
      query: (id) => ({
         url: `movies/${id}`,
         method: 'DELETE',
      }),
      invalidatesTags: ['Movie'],
    }),
     }),
});

export const { useGetMoviesQuery, useGetMovieByIdQuery, useAddMovieMutation, useImportMoviesMutation, useEditMovieMutation, useDeleteMovieMutation, useGetMoviesSearchQuery, useLazyGetMovieByIdQuery } = moviesApi;

