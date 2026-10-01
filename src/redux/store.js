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
        filter: includeAction(['chart/init', 'chart/deleteData', 'chart/endDraw']),
      }),
    },
  });

const store = makeStore();
export default store;
