import { stringify } from 'qs';
import request from '../utils/request';
import href from '../utils/constants';

export async function queryArticles() {
  return request(`/api/article/list`);
}
