import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, Button } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link, Redirect } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import MenuItem from 'antd/lib/menu/MenuItem';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  getMainMenu() {
    const { onMainMenuClick, match } = this.props;
    const mainMenu = this.props.mainMenu;

    const items = mainMenu.filter(menu => menu.path != "/user").
      map(menu => {
        return (
          <Menu.Item
            key={menu.path}
          >
            <Link
              to={menu.path}
              onClick={() => { onMainMenuClick(menu.path); }}
            >
              {menu.name}
            </Link>
          </Menu.Item>);
      });

    return (
      <Menu
        className={styles.menu}
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ height: '100%' }}
      >
        {items}
      </Menu>
    );

  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      mainMenu,
      loginBtn,
      logupBtn,
      logoutBtn
    } = this.props;
    const avatar = "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png";

    const loginAndLogup =(
      <div>
        <Button type="primary" onClick={loginBtn}>登录</Button>
        <Button type="primary" onClick={logupBtn}>注册</Button>
      </div>
    );
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon onClick={logoutBtn} type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <div className={styles.left}>
          <Icon
            className={styles.icon}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
        </div>
        <div className={styles.left}>
          {this.getMainMenu()}
        </div>
        <div className={styles.right}>
          <NoticeIcon
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={noticeData['通知']}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['消息']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              list={noticeData['待办']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
          {currentUser.email ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={avatar} />
                <span className={styles.name}>{currentUser.email}</span>
              </span>
            </Dropdown>
          ) : (<div style={{float: "right"}}>
            <Button style={{marginRight: "3px"}} type="primary" onClick={loginBtn}>登录</Button>
            <Button style={{marginLeft: "3px"}} type="primary" onClick={logupBtn}>注册</Button>
          </div>)}
        </div>
      </div>
    );
  }
}
