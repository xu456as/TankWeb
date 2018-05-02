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
import styles from './ProjectList.less';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
import ModalAdd from './ModalAdd';

@connect(({ user, project, loading }) => ({
  user,
  project,
  loading: loading.models.list
}))
export default class ProjectList extends PureComponent {

  state = {
    modalVisible: false,
    currentPage: 1,
    pageStart: 0,
    pageEnd: 5
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'project/fetch'
    });
  }

  getLogDetail = (url) => {
    // const {history} = this.props;
    // history.push({pathname: "/reply/detail", state: {url: url}});
  }

  openAddModal = () => {
    this.setState({modalVisible: true});
  }
  closeAddModal = () => {
    this.setState({modalVisible: false});
  }

  onAddSubmit = (data) => {
    this.props.dispatch({
      type: "project/upload",
      payload: {requestParam: data.requestParam, projectFile: data.projectFile}
    });
    this.closeAddModal();
  }

  onDeleteBtn = (projectId) => {
    // alert(projectId);
    this.props.dispatch({
      type: "project/delete",
      payload: {projectId: projectId}
    });
  }

  onDownloadBtn = (url) => {
    this.props.dispatch({
      type: "project/download",
      payload: {url: url}
    });
  }

  render() {
    // console.log(this.props);
    const { project, loading, user } = this.props;
    const currentUser = user.currentUser;
    const projectList = project.list;

    const paginationProps = {
      current: this.state.currentPage,
      pageSize: 5,
      total: projectList.length,
      onChange: (page, pageSize) => {
        var pageIdx = page - 1;
        var pageStart = pageIdx * pageSize;
        var pageEnd = pageStart + pageSize;
        pageEnd = pageEnd < projectList.length ? pageEnd : projectList.length;
        component.setState({pageStart: pageStart, pageEnd: pageEnd, currentPage: page});
      }
    };

    const ListContent = ({ data: { language, compressType, date } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>语音</span>
          <p>{language}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>格式</span>
          <p>{compressType}</p>
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
            title="项目列表"
            style={{ marginTop: 2 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Button onClick={this.openAddModal} disabled={!currentUser || !currentUser.type} type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
              添加项目
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={projectList}
              renderItem={item => {
                // console.log(item);
                return (
                  <List.Item
                  actions={[
                  <a onClick={() => this.onDownloadBtn(item.url)}>下载</a>,
                  <a onClick={() => this.onDeleteBtn(item.id)}>删除</a>
                  ]}>
                    <List.Item.Meta
                      title={item.name}
                      description={item.name}
                    />
                    <ListContent data={{...item}} />
                  </List.Item>
                );
              }}
            />
          </Card>
        </div>
        <ModalAdd
          visible={this.state.modalVisible}
          onSubmit={this.onAddSubmit}
          onCancel={this.closeAddModal}
        />
      </Layout>
    );
  }
}
