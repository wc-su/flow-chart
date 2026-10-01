import { describe, it, expect } from 'vitest';
import userReducer, { userActions, USER_STATUS } from './userSlice';

describe('userReducer', () => {
  it('初始狀態是 idle', () => {
    const state = userReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ status: USER_STATUS.IDLE });
  });

  it('login 把 status 設成 loggedIn', () => {
    const state = userReducer({ status: USER_STATUS.IDLE }, userActions.login());
    expect(state.status).toBe(USER_STATUS.LOGGED_IN);
  });

  it('logout 把 status 設成 loggedOut', () => {
    const state = userReducer({ status: USER_STATUS.LOGGED_IN }, userActions.logout());
    expect(state.status).toBe(USER_STATUS.LOGGED_OUT);
  });
});
