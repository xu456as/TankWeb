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
      console.log(response);
      if(response.code === "1"){
        yield put({
          type: "fetch"
        });
      }
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
