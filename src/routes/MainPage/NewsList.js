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
import {Layout} from 'antd';

import styles from './NewsList.less';

import queryArticles from '../../services/MainPageService';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ article, loading }) => ({
  article ,
  loading: loading.models.list}))
export default class NewsList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'article/fetch',
      payload: {}
    });
  }

  getArticleDetail = (id) => {

    const {history} = this.props;
    history.push({pathname: "/main-page/article", state: {id: id}});
  }

  render() {
    const { article:  article , loading } = this.props;
    const {articles} = article;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 10,
    };

    const ListContent = ( {data: { author, title, date, content } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>来源</span>
          <p>{author}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>时间</span>
          <p>{moment(date).format('YYYY-MM-DD')}</p>
        </div>
      </div>
    );

    return (
      <Layout style={{background: '#fff', height: '100%'}}>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="公告"
            style={{ marginTop: 2 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={articles}
              renderItem={item => {
                console.log(item);
                return (
                <List.Item >
                  <List.Item.Meta
                    title={<a onClick={() => this.getArticleDetail(item.id)}>{item.title}</a>}
                    description={item.author}
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
