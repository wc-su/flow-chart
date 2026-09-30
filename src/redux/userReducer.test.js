import { describe, it, expect } from 'vitest';
import userReducer, { userActions, USER_STATUS } from './userReducer';

describe('userReducer', () => {
  it('初始狀態是 idle', () => {
    const state = userReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ userStatus: USER_STATUS.IDLE });
  });

  it('login 把 userStatus 設成 loggedIn', () => {
    const state = userReducer({ userStatus: USER_STATUS.IDLE }, userActions.login());
    expect(state.userStatus).toBe(USER_STATUS.LOGGED_IN);
  });

  it('logout 把 userStatus 設成 loggedOut', () => {
    const state = userReducer({ userStatus: USER_STATUS.LOGGED_IN }, userActions.logout());
    expect(state.userStatus).toBe(USER_STATUS.LOGGED_OUT);
  });
});
