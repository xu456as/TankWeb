import { fakeRegister } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { logup } from '../services/UserService';

export default {
  namespace: 'register',

  state: {
    code: "0",
  },

  effects: {
    *submit({payload}, { call, put }) {
      const response = yield call(logup, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
      if (response.code === '1') {
        yield put({
          type: "login/login",
          payload: payload
        });
        yield put({
          type: "user/fetchCurrent"
        });
      }
      else{
        alert("账号已存在");
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        code: payload.code,
      };
    },
  },
};
