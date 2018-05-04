import { getRooms, createRoom, joinRoom } from '../services/RoomService';

export default {
  namespace: "room",
  state:{
    list: []
  },
  effects:{
    *fetch({payload}, {call, put}){
      // console.log(payload);
      const response = yield call(getRooms, payload.pageIndex, payload.pageSize);
      yield put({
        type: 'saveRoom',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *create({payload}, {call, put}){
      const response = yield call(createRoom, payload.projectId, payload.mapId);
      if(response.code === "1"){
        yield put({
          type: "fetch",
          payload: {pageIndex: 1, pageSize: 10}
        });
      }
    },
    *join({payload}, {call, put}){
      const response = yield call(joinRoom, payload.roomId, payload.projectId);
    }
  },
  reducers:{
    saveRoom(state, {payload}) {
      return {
        ...state,
        list: payload,
      };
    }
  }
}
