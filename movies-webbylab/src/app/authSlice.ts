import { createSlice } from '@reduxjs/toolkit';
import { ACCESS_TOKEN } from '../constants/cookies';

interface UserState {
  isAuthenticated: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state) {
      state.isAuthenticated = true;
    },
    cleanUser(state) {
      state.isAuthenticated = false;
      document.cookie = `${ACCESS_TOKEN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },
  },
});

export const { setUser, cleanUser } = authSlice.actions;

export default authSlice.reducer;