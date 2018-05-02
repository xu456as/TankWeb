import React from 'react';
import { Layout } from 'antd';
import { Switch, Redirect } from 'react-router-dom';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
const { Content } = Layout;
const { AuthorizedRoute, check } = Authorized;


export default class ReplyLayout extends React.PureComponent {

  render() {

    const { match, routerData } = this.props;

    return (
      <Layout style={{height: '100%', background: '#fff'}}>
        <div style={{background: '#fff'}}>
          <Content style={{height: '100%'}}>
            <Switch>
              {getRoutes(match.path, routerData).map(item => {
                const Component = item.component;
                return (
                  <AuthorizedRoute
                    key={item.key}
                    path={item.path}
                    render={props => <Component {...props} />}
                    exact={item.exact}
                    authority={item.authority}
                    redirectPath="/exception/403"
                  />
                );
              })
              }
              <Redirect from='/strategy-management' to="/strategy-management/list" />
            </Switch>
          </Content>
        </div>
      </Layout>
    );
  }
}
