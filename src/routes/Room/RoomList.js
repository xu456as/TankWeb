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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Layout } from 'antd';
import styles from './RoomList.less'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ room, map, project, loading }) => ({
  room,
  map,
  project,
  loading: loading.models.list
}))
export default class RoomList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'room/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 10
      }
    });
  }

  getLogDetail = (url) => {
    const {history} = this.props;
    // history.push({pathname: "/reply/detail", state: {url: url}});
  }

  render() {
    console.log(this.props);
    const { room, map, project, loading } = this.props;
    const roomList = room.list;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 10,
    };

    const ListContent = ({ data: { curChallengers, maxChallengers, startTime, duration, map } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>地图</span>
          <p>{map.name}</p>
        </div>
        {/* <div className={styles.listContentItem}>
          <span>当前人数</span>
          <p>{curChallengers}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>最大人数</span>
          <p>{maxChallengers}</p>
        </div> */}
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
                      title={`房间: ${item.id}`}
                      description={`${item.project.user.email}的${item.project.name}`}
                    />
                    <ListContent data={item} />
                  </List.Item>
                );
              }}
            />
          </Card>
        </div>
      </Layout>
    );
  }
}
