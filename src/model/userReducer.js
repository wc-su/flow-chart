import { createSlice } from "@reduxjs/toolkit";

const initialState = { userLogin: 0 };

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state) {
      state.userLogin = 1;
    },
    logout(state) {
      state.userLogin = 2;
    },
  },
});

export const userActions = userReducer.actions;

export default userReducer;
