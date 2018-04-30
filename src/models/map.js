import { getMaps, addMap } from '../services/BattleMapService';
import { readFileContent } from '../utils/utils';
export default {
  namespace: "map",
  state: {
    list: [],
    current: {}
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getMaps);
      // console.log(response);
      yield put({
        type: 'saveMap',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *upload({payload}, {call, put}){

      const queryString = {...payload};
      delete queryString.mapFile;
      // const body = yield call(readFileContent, payload.mapFile);
      // console.log({body: body});
      const response = yield call(addMap, queryString, payload.mapFile);
      console.log({response: response});
      if(response.code === 1){
        alert("Upload successfully");
      }
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
