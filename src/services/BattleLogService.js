import { stringify } from 'qs';
import request from '../utils/request';
import { href } from '../utils/constants';

const pathPrefix = '/log';

export async function getBattleLogs() {
  return request(`${href}${pathPrefix}/getLog`);
}
