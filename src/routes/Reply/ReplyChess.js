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
  }

  myLogin = async() => {
    let result = {};
    result = await login({
      "email": "xu456as@126.com",
      "password": "123456"
    });
    console.log(result);
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
    const {location} = this.props;
    let url = "";
    try{
      url = location.state.url;
    }catch(err){
      url = "";
    }
    alert(url);
    return (<div>
              <p>ReplyChess</p>
              <p><button onClick = {this.myLogin}>Login</button></p>
              <p><button onClick = {this.myLogup}>Logup</button></p>
              <p><button onClick = {this.myLogout}>Logout</button></p>
              <p><button onClick = {this.myGetLogs}>getLogs</button></p>
            </div>);
  }
}
export default ReplyChess;
