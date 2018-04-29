import React from 'react';
import { Avatar, Layout } from 'antd';
import styles from './ReplyChess.less'
const { Content } = Layout;
import { connect } from 'dva';
import { stringify } from 'qs';
import {login, logup, logout} from '../../services/UserService';

class ReplyChess extends React.PureComponent {

  state = {
    user : {}
  }

  componentDidMount() {

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
    return (<div>
              <p>ReplyChess</p>
              <p>{stringify(this.state.user)}</p>
              <p><button onClick = {this.myLogin}>Button</button></p>
              <p><button onClick = {this.myLogup}>Button</button></p>
              <p><button onClick = {this.myLogout}>Button</button></p>
            </div>);
  }
}
export default ReplyChess;
