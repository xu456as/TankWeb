
import {queryArticles} from '../services/MainPageService';

export default {
  namespace: "article",

  state: {
    articles: [],
    num : 0
  },

  effects: {
    *fetch({}, { call, put }) {
      const response = yield call(queryArticles);
      yield put({
        type: 'receiveArticles',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },
  reducers: {
    receiveArticles(state, {payload}) {
      return {
        articles: payload
      };
    },
  }
}
