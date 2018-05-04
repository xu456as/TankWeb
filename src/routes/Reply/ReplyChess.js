import React from 'react';
import { Avatar, Layout } from 'antd';
import styles from './ReplyChess.less'
const { Content } = Layout;
import { connect } from 'dva';
import { stringify } from 'qs';
import {login, logup, logout} from '../../services/UserService';
import { getBattleLogs } from '../../services/BattleLogService';

@connect(({reply}) => ({reply}))
class ReplyChess extends React.PureComponent {

  componentDidMount() {
    this.props.dispatch({
      type: 'reply/fetch'
    });
    this.props.dispatch({
      type: 'reply/download',
      payload: {
        url: '/data/tank_log/1525451137098.YourImagination.1.32767.1.32766'
      }
    });
  }

  myLogin = async() => {
    let result = {};
    result = await login({
      "email": "xu456as@126.com",
      "password": "123456"
    });
    // console.log(result);
  }
  myLogup = () => {
    logup(
      {
        "email": "xu456as@126.com",
        "password": "123456"
      }
    );
  }
  myLogout = () => {
    const result= logout();
    alert(result);
  }

  render() {
    console.log(this.props);
    const {location} = this.props;
    let url = "";
    try{
      url = location.state.url;
    }catch(err){
      url = "";
    }
    // alert(url);

    return (
      <Layout style={{ background: '#fff', height: '100%' }}>
        <Content>
        </Content>
      </Layout>
    );
  }
}
export default ReplyChess;
