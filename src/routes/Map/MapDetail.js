import React from 'react';
import { Avatar, Layout, Divider, Card, Col, Row, Menu, Button } from 'antd';
const ButtonGroup = Button.Group;
import styles from './MapDetail.less'
const { Content } = Layout;
import { connect } from 'dva';
import ModalEdit from './ModalEdit';

@connect(({ user, map }) => ({ user, map }))
export default class MapDetail extends React.PureComponent {

  state = {
    currentMap: {},
    modalVisible: false,
    row: 0,
    col: 0
  }

  componentDidMount() {
    const { location, map } = this.props;
    let id, currentMap;
    try {
      id = location.state.id;
      currentMap = map.list.filter((m) => {
        return m.id === id;
      })[0];
    } catch (err) {
      id = 0;
      currentMap = {}
    }
    this.setState({currentMap: currentMap});

    let url = null;
    try {
      url = location.state.downloadUrl;
    } catch (err) {
      url = null;
    }
    if (url != null) {
      this.props.dispatch({
        type: 'map/download',
        payload: {
          url: url
        }
      });
    }
  }
  mapArray = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];

  paintRow = (rowArray, idx) => {

    return (
      <div className={styles.mapRow} key={idx}>
        {rowArray.map((col, idx) => {
          let targetStyle = styles.emptyCell;
          if (col === 1) {
            targetStyle = styles.blockCell;
          }
          else if (col === 2) {
            targetStyle = styles.jungleCell;
          }
          return (<span key={idx} className={`${styles.mapCell} ${targetStyle}`}>
          </span>);
        })}
      </div>);
  }

  paintMap = (map) => {
    const rowLength = map.length;
    return (
      <div className={styles.map} style={{ width: rowLength * 20 + 'px', margin: "0 auto" }}>
        {map.map((rowArray, idx) => {
          return this.paintRow(rowArray, idx);
        })}
      </div>);
  }

  openEditModal = () => {
    this.setState({ modalVisible: true });
  }

  hideEditModal = () => {
    this.setState({ modalVisible: false });
  }


  handleEditMap = (data) => {
    // console.log(data);
    this.props.dispatch({
      type: 'map/edit',
      payload : data
    });
    this.setState({currentMap: data});
    this.setState({ modalVisible: false });
  }

  render() {
    // console.log(this.props);
    const { user, map, location } = this.props;
    const file = map.file;
    const currentUser = user.currentUser;
    // console.log(file);
    const mapSize = file.size;
    const currentMap = this.state.currentMap;
    // console.log(currentMap);

    const operationPanel = (
    <div>
    <Divider orientation="left">操作</Divider>
    <div style={{ margin: "0 auto", background: "#fff" }}>
      <p style={{ textAlign: "center" }}>
        <Button disabled={true} type="primary" style={{ margin: "10px" }} icon="close">删除</Button>
        <Button onClick={this.openEditModal} type="primary" style={{ margin: "10px" }} icon="tool">编辑参数</Button>
      </p>
    </div>
    </div>);

    return (
      <Layout style={{ background: '#fff', height: '100%' }}>
        <Content>
          <Divider orientation="left">坦克与子弹参数</Divider>
          <div style={{ background: '#fff', padding: '5px', textAlign: "center" }}>
            <Row gutter={8}>
              <Col span={4}>
                <Card title="坦克数量" bordered={false}>{currentMap.numberOfTank}</Card>
              </Col>
              <Col span={4}>
                <Card title="坦克移动速度" bordered={false}>{currentMap.tankSpeed}</Card>
              </Col>
              <Col span={4}>
                <Card title="坦克血量" bordered={false}>{currentMap.tankHp}</Card>
              </Col>
              <Col span={4}>
                <Card title="子弹移动速度" bordered={false}>{currentMap.shellSpeed}</Card>
              </Col>
              <Col span={4}>
                <Card title="子弹伤害值" bordered={false}>1</Card>
              </Col>
            </Row>
          </div>
          <Divider orientation="left">环境参数</Divider>
          <div style={{ background: '#fff', padding: '5px', textAlign: "center" }}>
            <Row gutter={4}>
              <Col span={4}>
                <Card title="消灭坦克获得分数" bordered={false}>{currentMap.tankScore}</Card>
              </Col>
              <Col span={4}>
                <Card title="夺取旗子获得分数" bordered={false}>{currentMap.flagScore}</Card>
              </Col>
              <Col span={4}>
                <Card title="最大回合数" bordered={false}>{currentMap.maxRound}</Card>
              </Col>
              <Col span={4}>
                <Card title="回合最大响应时间(ms)" bordered={false}>{currentMap.roundTimeout}</Card>
              </Col>
              <Col span={4}>
                <Card title="胜者得分" bordered={false}>{currentMap.winScore}</Card>
              </Col>
              <Col span={4}>
                <Card title="负者失分" bordered={false}>{currentMap.loseScore}</Card>
              </Col>
            </Row>
          </div>
          <Divider orientation="left">地图: {currentMap.name}</Divider>
          {this.paintMap(file.map)}
          <div>
            {currentUser && currentUser.type===1 && operationPanel}
          </div>
          <ModalEdit visible={this.state.modalVisible}
            currentMap={currentMap}
            onCancel={this.hideEditModal}
            onSubmit={this.handleEditMap}
          />
        </Content>
      </Layout>
    );
  }
}
