import { configureStore } from '@reduxjs/toolkit';
import undoable, { includeAction } from 'redux-undo';

import userReducer from './userSlice';
import chartReducer from './chartSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      chart: undoable(chartReducer, {
        limit: 50, // 最多存 50 步，超過丟掉最舊的
        // 只記錄「一次操作完成」的 action
        filter: includeAction(['chart/init', 'chart/deleteShape', 'chart/endDraw']),
      }),
    },
  });

const store = makeStore();
export default store;
