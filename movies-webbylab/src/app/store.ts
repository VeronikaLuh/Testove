import { configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction} from '@reduxjs/toolkit';
import searchReducer from './search';
import { moviesApi } from '../api/moviesRtkApi';
import { authApi } from "../api/authApi";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        search: searchReducer,
        [moviesApi.reducerPath]: moviesApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        authSlice: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(moviesApi.middleware)
        .concat(authApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;