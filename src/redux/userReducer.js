import { createSlice } from '@reduxjs/toolkit';

export const USER_STATUS = Object.freeze({
  IDLE: 'idle',
  LOGGED_IN: 'loggedIn',
  LOGGED_OUT: 'loggedOut',
});

const initialState = { userStatus: USER_STATUS.IDLE };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state) {
      state.userStatus = USER_STATUS.LOGGED_IN;
    },
    logout(state) {
      state.userStatus = USER_STATUS.LOGGED_OUT;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
