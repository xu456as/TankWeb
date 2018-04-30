import { getMaps } from '../services/BattleMapService';

export default {
  namespace: "map",
  state: {
    list: [],
    current: {}
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getMaps);
      console.log(response);
      yield put({
        type: 'saveMap',
        payload: Array.isArray(response) ? response : [],
      });
    }
  },
  reducers: {
    saveMap(state, {payload}) {
      return {
        ...state,
        list: payload,
      };
    }
  }
};
