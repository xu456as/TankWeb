import React from 'react';
import { Avatar, Layout, Button, Divider } from 'antd';
import styles from './ReplyChess.less'
const { Content, Sider } = Layout;
import { connect } from 'dva';
import { stringify } from 'qs';
import { login, logup, logout } from '../../services/UserService';
import { getBattleLogs } from '../../services/BattleLogService';

@connect(({ reply }) => ({ reply }))
class ReplyChess extends React.PureComponent {

  state = {
    currentStep: 0,
    playHandler: null
  }

  componentDidMount() {
    let reply = undefined;
    try{
      reply = this.props.location.state.reply;
    }catch(err){

    }
    if(!reply){
      return;
    }
    console.log(reply);
    this.props.dispatch({
      type: 'reply/fetch'
    });
    if(!reply.url){
      return;
    }

    const id = reply.id.split('.');
    console.log(id);
    const aPort = id[3];
    const bPort = id[5];
    this.props.dispatch({
      type: 'reply/download',
      payload: {
        url: '/data/tank_log/1525451137098.YourImagination.1.32767.1.32766',
        // url: reply.url,
        aPort: aPort,
        bPort: bPort
      }
    });
  }


  paintRow = (rowArray, rowIdx) => {

    return (
      <div className={styles.mapRow} key={rowIdx}>
        {rowArray.map((col, colIdx) => {
          let targetStyle = styles.emptyCell;
          if (col === 1) {
            targetStyle = styles.blockCell;
          }
          else if (col === 2) {
            targetStyle = styles.jungleCell;
          }
          return (<span key={colIdx} className={`${styles.mapCell} ${targetStyle}`}>
          </span>);
        })}
      </div>);
  }

  paintMap = (map) => {
    const rowLength = map.length;
    return (
      <div className={styles.map} style={{ width: rowLength * 20 + 'px', margin: "0 auto" }}>
        {map.map((rowArray, rowIdx) => {
          return this.paintRow(rowArray, rowIdx);
        })}
      </div>);
  }
  paintTanks = (tanks) => {
    if (!tanks || tanks.length == 0) {
      return null;
    }
    const tankNodes = tanks.map((tank) => {
      const {position, speed, dir, type, status} = tank;
      // console.log(tank);
      let styleDir = "";
      let styleColor = styles.tankBlue;
      switch(dir){
        case 'up':
          styleDir = styles.tankUp;
        break;
        case 'down':
          styleDir = styles.tankDown;
        break;
        case 'left':
          styleDir = styles.tankLeft;
        break;
        case 'right':
        styleDir = styles.tankRight;
        break;
        default:
      }
      if(type == "red"){
        styleColor = styles.tankRed;
      }
      if(status != "alive"){
        styleColor = styles.tankDestroy;
      }
      return (<div key={tank.id} className={`${styles.tank} ${styleColor} ${styleDir}`} style={{
        left: (position ? position.y * 20 : 0) + 'px',
        top: (position ? position.x * 20 : 0) + 'px',
        transitionDuration: speed ? speed * 0.8 + 'ms' : '500ms'
      }} />);
    });
    // console.log(tankNodes);
    return tankNodes;
  }
  paintShells = (shells) => {
    if (!shells || shells.length == 0) {
      return null;
    }

    const shellNodes = shells.map((shell, index) => {
       const { dir, status, position, speed } = shell;
       let styleDir = "";
       switch(dir){
         case 'up':
           styleDir = styles.shellUp;
         break;
         case 'down':
           styleDir = styles.shellDown;
         break;
         case 'left':
           styleDir = styles.shellLeft;
         break;
         case 'right':
         styleDir = styles.shellRight;
         break;
         default:
       }
       return (<div key={index} className={` ${styles.shellRed} ${styles.shell} ${styleDir}`} style={{
        left: (position ? position.y * 20 : 0) + 'px',
        top: (position ? position.x * 20 : 0) + 'px',
        transitionDuration: speed ? speed * 0.8 + 'ms' : '500ms'
      }} />);
    });
    return shellNodes;
    // console.log(shells);
  }

  paintFlag = (flag) => {
    if(flag){
      return (<div className={`${styles.flag}`}></div>);
    }
  }

  stop = () => {
    clearInterval(this.playHandler);
  }

  play = () => {
    this.setState({currentStep: 0});
    const playHandler = setInterval(() => {
      const currentStep = this.state.currentStep;
      this.setState({ currentStep: currentStep + 1 });
      if (this.currentStep >= this.props.reply.data.replayLogs.length) {
        this.stop();
      }
    }, 250);

    this.setState({ playHandler: playHandler });
  }

  parseResult = (number) => {
    switch(number){
      case '1':
        return "红方";
      case '2':
        return "蓝方";
      default:
        return "无";
    }
  }

  render() {
    // console.log(this.props);
    const { location, reply } = this.props;
    const data = reply.data;
    const replayLogs = data.replayLogs;
    // console.log(replayLogs);
    let replyInfo = {};
    try {
      replyInfo = location.state.reply;
    } catch (err) {
      replyInfo = {};
    }
    // console.log(replyInfo);

    replayLogs && replayLogs.length > 0 && console.log(replayLogs[0]);
    return (
      <Layout style={{ background: '#fff', height: '100%' }}>
        <Content>
          {
            data.map &&
            (<div style={{ margin: "0 auto", position: "relative", width: data.map.map.length * 20 + 'px' }}>
              {data.map && this.paintMap(data.map.map)}
              {replayLogs && this.state.currentStep < this.props.reply.data.replayLogs.length && this.paintShells(replayLogs[this.state.currentStep].shells)}
              {replayLogs && this.state.currentStep < this.props.reply.data.replayLogs.length && this.paintTanks(replayLogs[this.state.currentStep].tanks)}
              {replayLogs && this.state.currentStep < this.props.reply.data.replayLogs.length && this.paintFlag(replayLogs[this.state.currentStep].flag)}
            </div>)
          }
        </Content>
        <Sider style={{ background: "#fff" }} width="400">
          <div>房主（红方）局内得分：{replyInfo.ascore}</div>
          <div>访客（蓝方）局内得分：{replyInfo.bscore}</div>
          <Divider/>
          <div>胜者：{this.parseResult(replyInfo.winner)}</div>
          <Divider/>
          <p style={{ textAlign: "center" }}><Button onClick={this.play} type="primary">开始播放</Button></p>
        </Sider>
      </Layout>
    );
  }
}
export default ReplyChess;
