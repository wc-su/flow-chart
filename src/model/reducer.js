import { userLogin, userLogout } from "./action";
import { createReducer } from "@reduxjs/toolkit";

const testUserLogin = 0;

const testUserLoginReducer = createReducer(testUserLogin, (builder) => {
  builder
    .addCase(userLogin, (state, action) => {
      state = 1;
    })
    .addCase(userLogout, (state, action) => {
      state = 2;
    });
});

export { testUserLoginReducer };
