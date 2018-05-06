import { queryCurrent } from '../services/UserService';
export default {
  namespace: 'user',

  state: {
    currentUser: {}
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: {...response, notifyCount: 0},
      });
    },
    *logout(_, { call, put }) {
      // console.log("user/logout");
      yield put({
        type: 'clearUser'
      });
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    clearUser(state, action){
      return {
        currentUser : {}
      }
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
