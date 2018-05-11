import { stringify } from 'qs';
import request from '../utils/request';
import {href} from '../utils/constants';

const pathPrefix = "/rank";

export async function getRankList(pageIndex) {
  return request(`${href}${pathPrefix}/list?${stringify({pageIdx: pageIndex})}`);
}
