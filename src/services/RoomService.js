import { stringify } from 'qs';
import request from '../utils/request';
import {href} from '../utils/constants';

const pathPrefix = "/room";

export async function getRooms(pageIndex, pageSize) {
  return request(`${href}${pathPrefix}/getRooms?${stringify({pageIdx: pageIndex, pageSize: pageSize})}`);
}

export async function createRoom(projectId, mapId){
  return request(`${href}${pathPrefix}/create?${stringify({projectId: projectId, mapId: mapId})}`,{
    method: 'POST'
  });
}
