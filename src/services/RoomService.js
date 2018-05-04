import { stringify } from 'qs';
import request from '../utils/request';
import {href} from '../utils/constants';

const pathRoomPrefix = "/room";
const pathSchedulePrefix = "/schedule";

export async function getRooms(pageIndex, pageSize) {
  // console.log()
  return request(`${href}${pathRoomPrefix}/getRooms?${stringify({pageIdx: pageIndex, pageSize: pageSize})}`);
}

export async function createRoom(projectId, mapId){
  return request(`${href}${pathRoomPrefix}/create?${stringify({projectId: projectId, mapId: mapId})}`,{
    method: 'POST'
  });
}

export async function joinRoom(roomId, projectId){
  return request(`${href}${pathSchedulePrefix}/play?${stringify({roomId: roomId, projectId: projectId})}`,{
    method: 'POST'
  });
}
