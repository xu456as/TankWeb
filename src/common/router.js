import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }

      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/main-page': {
      component: dynamicWrapper(app, [], ()=> import('../layouts/MainPageLayout') ),
    },
    '/main-page/news-list': {
      component: dynamicWrapper(app, ['article'], () => import('../routes/MainPage/NewsList')),
    },
    '/main-page/article': {
      component: dynamicWrapper(app, [], () => import('../routes/MainPage/Article')),
    },
    '/room': {
      component: dynamicWrapper(app, [], () => import('../layouts/RoomLayout')),
    },
    '/room/list':{
      component: dynamicWrapper(app, ['room', 'map', 'user', 'project'], () => import('../routes/Room/RoomList')),
    },
    '/rank': {
      component: dynamicWrapper(app, [], () => import('../layouts/RankLayout')),
    },
    '/rank/list': {
      component: dynamicWrapper(app, ['rank'], () => import('../routes/Rank/RankList')),
    },
    '/strategy-management': {
      component: dynamicWrapper(app, [], () => import('../layouts/StrategyManagementLayout')),
    },
    '/strategy-management/list': {
      component: dynamicWrapper(app, ['user', 'project'], () => import('../routes/StrategyManagement/ProjectList'))
    },
    '/reply': {
      component: dynamicWrapper(app, [], () => import('../layouts/RelayLayout')),
    },
    '/reply/list': {
      component: dynamicWrapper(app, ['reply'], () => import('../routes/Reply/ReplyList')),
    },
    '/reply/detail':{
      component: dynamicWrapper(app, ['reply'], () => import('../routes/Reply/ReplyChess')),
    },
    '/map':{
      component: dynamicWrapper(app, [], () => import('../layouts/MapLayout')),
    },
    '/map/list':{
      component: dynamicWrapper(app, ['user', 'map'], () => import('../routes/Map/MapList')),
    },
    '/map/detail':{
      component: dynamicWrapper(app, ['user', 'map'], () => import('../routes/Map/MapDetail')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import("../layouts/UserLayout")),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/userDetail': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/User/Detail')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },

  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
