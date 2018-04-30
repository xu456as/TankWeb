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
import styles from './MapList.less'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({user, map, loading }) => ({
  user,
  map,
  loading: loading.models.list
}))
export default class MapList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'map/fetch'
    });
  }

  getMapDetail = (url) => {
    const {history} = this.props;
    history.push({pathname: "/map/detail", state: {id: id}});
  }

  render() {
    console.log(this.props);
    const { user, map, loading } = this.props;
    const mapList = map.list;
    const currentUser = user.currentUser;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 10,
    };

    const ListContent = ({ data: { user, date } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>作者</span>
          <p>{user.email}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>时间</span>
          <p>{moment(date).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      </div>
    );

    return (
      <Layout style={{ background: '#fff', height: '100%' }}>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="地图列表"
            style={{ marginTop: 2 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
          <Button disabled={!currentUser || currentUser.type !==1} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={mapList}
              renderItem={item => {
                // console.log(item);
                return (
                  <List.Item >
                    <List.Item.Meta
                      title={<a onClick={() => {}}>{item.name}</a>}
                      description={item.name}
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
