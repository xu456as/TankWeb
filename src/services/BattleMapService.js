import { stringify } from 'qs';
import request from '../utils/request';
import { href } from '../utils/constants';

const pathPrefix = '/map';

export async function getMaps() {
  return request(`${href}${pathPrefix}/getAll`);
}
export async function addMap(queryString, mapFile){
  let formData = new FormData();
  console.log(mapFile);
  formData.append("mapFile", mapFile);
  console.log("battleMapService.addMap");
  return request(`${href}${pathPrefix}/add?${stringify(queryString)}`, {
    method: 'POST',
    body: formData
  });
}
