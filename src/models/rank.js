import { queryCurrent } from '../services/UserService';
import { getRankList } from '../services/RankService';

export default {
  namespace: 'rank',

  state: {
    list: []
  },

  effects: {
    *fetch({payload}, {call, put}){
      // console.log(payload);
      const response = yield call(getRankList, payload.pageIndex);
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
        list: action.payload,
      };
    },
  },
};
