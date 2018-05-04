import { getBattleLogs } from '../services/BattleLogService';
import {parseFile as parseMap } from './map';
import { downloadAsText } from '../services/CommonService';

export default {
  namespace: 'reply',

  state: {
    logs: [],
    data: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getBattleLogs);
      yield put({
        type: 'save',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *download({payload}, {call, put}){
      const response = yield call(downloadAsText, payload.url);
      console.log(response);
      yield put({
        type: 'saveFile',
        payload: parseLog(response),
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        logs: action.payload,
      };
    },
    saveFile(state, {payload}){
      return {
        ...state,
        data: payload
      };
    }
  },
};


function parseLog(res) {
  const mapDataMatches = /const\s+MAP_1\s+=\s+'([\d\s\n\r]*)'/g.exec(res || '');
  let map, blueHost, redHost, replayLogs;
  if (mapDataMatches) {
    const mapSource = mapDataMatches[1];
    map = parseMap(mapSource);
  }
  const logs = (res || '').split('\n').filter((line) => {
    return line.indexOf('ReplayLog:') !== -1;
  }).map((log) => {
    return log.replace(/ReplayLog:/g, '').replace(/,,/g, ',').replace(/(dir|status|owner):([\w\-\.:]+)/g, ($1, $2, $3) => { // eslint-disable-line
      return $2 + ':' + `"${$3}"`;
    });
  });
  try {
    replayLogs = eval('[' + logs.join(',') + ']'); // eslint-disable-line
    const firstLog = (replayLogs || [])[0];
    if (firstLog && firstLog.tanks) {
      firstLog.tanks.forEach((tank) => {
        if (!blueHost) {
          blueHost = tank.owner;
        }
        if (!redHost && blueHost !== tank.owner) {
          redHost = tank.owner;
        }
      })
    }
    replayLogs.forEach(({ tanks = [], shells = [] }) => {
      tanks.forEach((tank) => {
        tank.type = (blueHost === tank.owner) ? 'blue' : 'red';
        tank.dir = (tank.dir || '').toLowerCase();
      });
      shells.forEach((shell) => {
        shell.dir = (shell.dir || '').toLowerCase();
      });
    });
  } catch (err) {
    // console.log("error");
  }
  return {
    map: map,
    blueHost: blueHost,
    redHost: redHost,
    replayLogs: replayLogs
  };
}
