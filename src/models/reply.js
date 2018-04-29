import { getBattleLogs } from '../services/BattleLogService';
export default {
  namespace: 'reply',

  state: {
    logs: []
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getBattleLogs);
      yield put({
        type: 'save',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
  },
};
