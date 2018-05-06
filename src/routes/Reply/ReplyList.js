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
import styles from './ReplyList.less'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ reply, loading }) => ({
  reply,
  loading: loading.models.list
}))
export default class ReplyList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'reply/fetch'
    });
  }

  getLogDetail = (item) => {
    const {history} = this.props;
    history.push({pathname: "/reply/detail", state: {reply: item}});
  }

  render() {
    console.log(this.props);
    const { reply, loading } = this.props;
    const replylogs = reply.logs;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 10,
    };

    const ListContent = ({ data: { mapName, projectAId, projectBId, date } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>地图</span>
          <p>{mapName}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Host项目</span>
          <p>{projectAId}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Guest项目</span>
          <p>{projectBId}</p>
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
            title="回放列表"
            style={{ marginTop: 2 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={replylogs}
              renderItem={item => {
                // console.log(item);
                return (
                  <List.Item >
                    <List.Item.Meta
                      title={<a onClick={() => { this.getLogDetail(item) }}>{item.id}</a>}
                      description="战斗回放"
                    />
                    <ListContent data={{ mapName: item.id.split("|")[1], ...item }} />
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
