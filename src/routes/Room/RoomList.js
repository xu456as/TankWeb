import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
} from 'antd';
import ModalCreate from './ModalCreate';
import ModalJoin from './ModalJoin';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Layout, notification } from 'antd';
import styles from './RoomList.less'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ user, room, map, project, loading }) => ({
  user,
  room,
  map,
  project,
  loading: loading.models.list
}))
export default class RoomList extends PureComponent {

  state = {
    roomSelectedId: null,
    modalCreateVisible: false,
    modalJoinVisible: false
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'room/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10
      }
    });
    this.props.dispatch({
      type: 'map/fetch'
    });
    this.props.dispatch({
      type: 'project/fetch'
    });
  }

  onPageChange = (page) => {
    this.props.dispatch({
      type: 'room/fetch',
      payload: {
        pageIndex: page,
        pageSize: 10
      }
    });
  }

  createRoomBtn = (projectId, mapId) => {
    // console.log("createRoomBtn");
    this.props.dispatch({
      type: 'room/create',
      payload: {
        projectId: projectId,
        mapId: mapId
      }
    });
    this.setState({modalCreateVisible: false});
  }
  joinRoomBtn = (roomId, projectId) => {
    this.props.dispatch({
      type: 'room/join',
      payload: {
        roomId: roomId,
        projectId: projectId
      }
    });
    this.setState({modalJoinVisible: false});
    notification['success']({
      message: '请求已上传',
      description: '如果已经比赛完成则会向你发送对战回放，请关注战斗回放栏目',
    });
  }

  openModalCreateBtn = () => {
    this.setState({modalCreateVisible: true});
  }

  openModalJoinBtn = (roomSelectedId) => {
    this.setState({modalJoinVisible: true, roomSelectedId: roomSelectedId});
  }

  closeModalCreateBtn = () => {
    this.setState({modalCreateVisible: false});
  }
  closeModalJoinBtn = () => {
    this.setState({modalJoinVisible: false});
  }

  getLogDetail = (url) => {
    const {history} = this.props;
    // history.push({pathname: "/reply/detail", state: {url: url}});
  }

  render() {
    console.log(this.props);
    const { user, room, map, project, loading } = this.props;
    const roomList = room.list;
    const mapList = map.list;
    const projectList = project.list;
    const currentUser = user.currentUser;

    const paginationProps = {
      pageSize: 10,
      total: roomList.length,
      onChange: (page, pageSize) => {
        this.onPageChange(page);
      }
    };

    const ListContent = ({ data: { curChallengers, maxChallengers, startTime, duration, map } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>地图</span>
          <p>{map.name}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>开始时间</span>
          <p>{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>结束时间</span>
          <p>{moment(parseInt(startTime) + parseInt(duration)).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      </div>
    );

    return (
      <Layout style={{ background: '#fff', height: '100%' }}>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="房间"
            style={{ marginTop: 2 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Button onClick={this.openModalCreateBtn} disabled={!currentUser || currentUser.type !== 1} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              创建房间
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={roomList}
              renderItem={item => {
                return (
                  <List.Item >
                    <List.Item.Meta
                      title={<a onClick={() => {this.openModalJoinBtn(item.id);}}>{`房间: ${item.id}`}</a>}
                      description={`${item.project.user.email}的${item.project.name}`}
                    />
                    <ListContent data={item} />
                  </List.Item>
                );
              }}
            />
          </Card>
          <ModalCreate
            visible={this.state.modalCreateVisible}
            currentUser={currentUser}
            mapList={mapList}
            projectList={projectList}
            onSubmit={this.createRoomBtn}
            onCancel={this.closeModalCreateBtn}
          />
          <ModalJoin
            visible={this.state.modalJoinVisible}
            currentUser={currentUser}
            roomId={this.state.roomSelectedId}
            projectList={projectList}
            onSubmit={this.joinRoomBtn}
            onCancel={this.closeModalJoinBtn}
          />
        </div>
      </Layout>
    );
  }
}
