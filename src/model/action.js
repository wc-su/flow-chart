import { createAction } from "@reduxjs/toolkit";

const userLogin = createAction("user/login");
const userLogout = createAction("user/logout");

export { userLogin, userLogout };
