import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '主页',
    icon: 'dashboard',
    path: 'main-page'
  },
  {
    name: '游戏大厅',
    icon: 'table',
    path: 'room'
  },
  {
    name: '排行榜',
    icon: 'warning',
    path: 'rank'
  },
  {
    name: '策略管理',
    icon: 'profile',
    path: 'strategy-management'
  },
  {
    name: '战斗回放',
    icon: 'warning',
    path: 'reply'
  },
  {
    name: '地图',
    icon: 'map',
    path: 'map'
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
