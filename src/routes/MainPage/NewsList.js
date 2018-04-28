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
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

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
        {/* <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div> */}
      </div>
    );

    const menu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>删除</a>
        </Menu.Item>
      </Menu>
    );

    const MoreBtn = () => (
      <Dropdown overlay={menu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );
    return (
      <Layout style={{background: '#fff'}}>
        <div className={styles.standardList}>
          {/* <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的待办" value="8个任务" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周任务平均处理时间" value="32分钟" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本周完成任务数" value="24个任务" />
              </Col>
            </Row>
          </Card> */}

          <Card
            className={styles.listCard}
            bordered={false}
            title="公告"
            style={{ marginTop: 2 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            // extra={extraContent}
          >
            {/* <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加
            </Button> */}
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
