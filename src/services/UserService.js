import { stringify } from 'qs';
import request from '../utils/request';
import { href } from '../utils/constants';

const pathPrefix = '/user';

export async function login(params) {
  return request(`${href}${pathPrefix}/login`, {
    method: 'POST',
    body: params
  });
}

export async function logup(params) {
  return request(`${href}${pathPrefix}/logup`, {
    method: 'POST',
    body: params
  });
}

export async function logout() {
  return request(`${href}${pathPrefix}/logout`, {method: 'POST'});
}

export async function queryCurrent(){
  return request(`${href}${pathPrefix}/queryCurrent`, {method: 'POST'});
}
