import { routerRedux } from 'dva/router';
import { push } from 'react-router-redux'
import { fakeAccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import {login, logup, logout} from '../services/UserService';
export default {
  namespace: 'login',

  state: {
    code: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(login, payload);
      console.log(response);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === '1') {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
      else{
        alert("账号或密码错误");
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            code: "0",
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        code: payload.code,
        type: "account"
      };
    },
  },
};
