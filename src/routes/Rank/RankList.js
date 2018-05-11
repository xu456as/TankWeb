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
import styles from './RankList.less'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ rank, loading }) => ({
  rank,
  loading: loading.models.list
}))
export default class RankList extends PureComponent {

  state = {
    currentPage: 1,
    // pageStart: 0,
    // pageEnd: 5
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'rank/fetch',
      payload: {
        pageIndex: this.state.currentPage,
      }
    });
  }

  getLogDetail = (item) => {
    const {history} = this.props;
    // history.push({pathname: "/reply/detail", state: {reply: item}});
  }

  render() {
    console.log(this.props);
    const { rank, loading } = this.props;
    const rankList = rank.list;

    // const paginationProps = {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   pageSize: 5,
    //   total: 10,
    // };

    const paginationProps = {
      current: this.state.currentPage,
      pageSize: 10,
      total: rankList,
      onChange: (page, pageSize) => {
        // var pageIdx = page - 1;
        // var pageStart = pageIdx * pageSize;
        // var pageEnd = pageStart + pageSize;
        // pageEnd = pageEnd < projectList.length ? pageEnd : projectList.length;
        // component.setState({pageStart: pageStart, pageEnd: pageEnd, currentPage: page});
        component.setState({currentPage: page});
      }
    };

    const ListContent = ({ data: { score } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>总积分</span>
          <p>{score}</p>
        </div>
      </div>
    );

    return (
      <Layout style={{ background: '#fff', height: '100%' }}>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="排行榜"
            style={{ marginTop: 2 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={rankList}
              renderItem={item => {
                // console.log(item);
                return (
                  <List.Item >
                    <List.Item.Meta
                      title={<a onClick={() => {}}>{item.email}</a>}
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
