import { stringify } from 'qs';
import fetch from 'dva/fetch';
import request from '../utils/request';
import { href } from '../utils/constants';

const pathPrefix = '/common';

export async function downloadAsText(url){

  console.log(url);
  return fetch(`${href}${pathPrefix}/download?url=${url}`)
  .then(res => {
    // return new Promise(function (resolve, reject) {
    //   let reader = new FileReader();
    //   reader.onload = function () {
    //     resolve(reader);
    //   };
    //   reader.onerror = reject;
    //   console.log(res.blob());
    //   reader.readAsText(res.blob());
    // }).then(reader => {return reader.result;});
    return res.blob();
  })
  .then(blob => {
    // console.log(blob);
    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.onload = function () {
        resolve(reader);
      };
      reader.onerror = reject;
      reader.readAsText(blob);
    }).then(reader => {return reader.result;});
    // return blob;
  });
}

export async function download(srcUrl){
  return fetch(`${href}${pathPrefix}/download?url=${srcUrl}`)
  .then(res => res.blob().then(blob => {
    var a = document.createElement('a');
    var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
    var filename = res.headers.get('File-Name');
    var nameList = srcUrl.split("/");
    // alert(filename);
    a.href = url;
    a.download = nameList[nameList.length - 1];
    a.click();
    window.URL.revokeObjectURL(url);
  }));
}
