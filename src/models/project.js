import { download } from '../services/CommonService';
import {
  getProjects,
  addProject,
  editProject,
  deleteProject
  } from '../services/StrateManagementService';

export default {
  namespace: "project",
  state: {
    list: []
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getProjects);
      yield put({
        type: 'save',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *upload({payload}, {call, put}){
      const response = yield call(addProject, payload.requestParam, payload.projectFile);
      // console.log(response);
      if(response.code === "1"){
        yield put({
          type: "fetch"
        });
      }
    },
    *delete({payload}, {call, put}){
      console.log(payload);
      const response = yield call(deleteProject, payload.projectId);
      if(response.code === "1"){
        yield put({
          type: "fetch"
        });
      }
    },
    *download({payload}, {call, put}){
      yield call(download, payload.url);
    }
  },
  reducers: {
    save(state, {payload}){
      return {
        ...state,
        list: payload
      };
    }
  }
}
