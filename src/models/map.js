import { getMaps, addMap, editMap } from '../services/BattleMapService';
import { downloadAsText } from '../services/CommonService';
import { readFileContent } from '../utils/utils';
export default {
  namespace: "map",
  state: {
    list: [],
    file: {
      size: 0,
      map: []
    }
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
    *edit({payload}, {call, put}){
      const response = yield call(editMap, payload);
      if(response.code === 1){
        yield put({type: "fetch"});
      }
    },
    *upload({payload}, {call, put}){

      const queryString = {...payload};
      delete queryString.mapFile;
      // const body = yield call(readFileContent, payload.mapFile);
      // console.log({body: body});
      const response = yield call(addMap, queryString, payload.mapFile);
      // console.log({response: response});
      if(response.code === 1){
        alert("Upload successfully");
      }
    },
    *download({payload}, {call, put}){
      const response = yield call(downloadAsText, payload.url);
      // console.log(response);
      yield put({
        type: 'saveFile',
        payload: parseFile(response),
      });
    },
  },
  reducers: {
    saveMap(state, {payload}) {
      return {
        ...state,
        list: payload,
      };
    },
    saveFile(state, {payload}){
      return {
        ...state,
        file: payload
      }
    }

  }
};

export function parseFile(res){
  const lines = res.split('\n');
  let sizeInited = false;
  let size;
  let map = [];
  lines.forEach((line) => {
    if (!sizeInited && line.indexOf('size:') > -1) {
      size = +line.replace('size:', '').trim();
      sizeInited = true;
    } else if (line.indexOf('//') === -1) {
      map.push(line.split(' ').map(val => {
        return parseInt(val);
      }));
    }
  });
  if(map.length > size){
    map = map.slice(0, size);
  }
  if (!size && map[0]) {
    size = map[0].length;
  }

  return {
    size,
    map
  }
}
