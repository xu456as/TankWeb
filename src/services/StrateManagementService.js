import { stringify } from 'qs';
import request from '../utils/request';
import {href} from '../utils/constants';

const pathPrefix = "/strategyManagement";

export async function getProjects() {
  return request(`${href}${pathPrefix}/getProjects`);
}

export async function addProject(queryString, projectFile){
  let formData = new FormData();
  formData.append("projectFile", projectFile);
  return request(`${href}${pathPrefix}/upload?${stringify(queryString)}`,{
    method: 'POST',
    body: formData
  });
}

export async function editProject(queryString, projectFile){
  let formData = new FormData();
  formData.append("projectFile", projectFile);
  return request(`${href}${pathPrefix}/edit?${stringify(queryString)}`,{
    method: 'POST',
    body: formData
  });
}

export async function deleteProject(projectId){
  return request(`${href}${pathPrefix}/delete?${stringify({projectId: projectId})}`, {method: 'POST'});
}
