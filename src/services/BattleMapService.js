import { stringify } from 'qs';
import request from '../utils/request';
import { href } from '../utils/constants';

const pathPrefix = '/map';

export async function getMaps() {
  return request(`${href}${pathPrefix}/getAll`);
}
