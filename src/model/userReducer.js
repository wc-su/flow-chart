import { createSlice } from "@reduxjs/toolkit";

const initialState = { userStatus: 0 };

const userReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state) {
      state.userStatus = 1;
    },
    logout(state) {
      state.userStatus = 2;
    },
  },
});

export const userActions = userReducer.actions;

export default userReducer;
