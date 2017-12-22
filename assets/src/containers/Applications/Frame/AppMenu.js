/**
 * Created by zhengguo.chen on 16/11/29.
 */

import React from 'react';
import {hashHistory} from "react-router";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import appsActions from 'actions/apps';
import rootActions from 'actions/root';
import STYLE from './style.less';
import Method from 'components/Method';
import AppModal from './AppModal';
import {Menu, Icon, Select, Spin, Dropdown, message, Popconfirm, Badge} from "antd";
const SubMenu = Menu.SubMenu;

import {API_INITIAL_DATA} from 'constants/config';

const getApiPath = (appId, apiId, groupId) => {
  return `/apps/${appId}/api/${apiId}${groupId ? '/group/' + groupId: ''}`;
};

var AppMenu = React.createClass({

  getInitialState() {
    return {
      appModalVisible: false,
      currentApp: null
    }
  },

  onExpandApp(keys) {
    console.log(`onExpandApp`, keys);
    this.props.onGetAppList(keys);
  },

  onAddApp() {
    this.setState({
      appModalVisible: true,
      currentApp: null
    });
  },

  onEditApp(currentApp) {
    this.setState({
      appModalVisible: true,
      currentApp
    });
  },

  onSaveApp(appData) {
    const {
      actions: {getAppList, createApp, updateApp}
    } = this.props;

    (appData.id ?
      updateApp(appData.id, appData) :
      createApp(appData)
    ).then(res => {
      if(!res.error) {
        getAppList();
        message.success(`${appData.id ? 'Update' : 'Create'} Application successfully.`);
        this.setState({appModalVisible: false});
      }
    });
  },

  onAddApi(appData) {
    const {
      actions: {createApi, getApiList},
      apps: {currentGroupId}
    } = this.props;

    createApi(
      appData.id,
      Object.assign({}, API_INITIAL_DATA, {
        response: appData.responseTemplate
      })
    ).then(res => {
      if(!res.error) {
        getApiList(appData.id);
        hashHistory.push(getApiPath(appData.id, res.payload.id, currentGroupId));
        message.success('Create API successfully.');
      }
    });
  },

  onDeleteApp(appData) {
    const {
      actions: {deleteApp, getAppList}
    } = this.props;

    deleteApp(appData.id)
      .then(res => {
        if(!res.error) {
          getAppList();
          // @todo change current api url
          message.success('Delete application successfully.');
        }
      });
  },

  onDeleteApi(appData, apiData) {
    const {
      actions: {deleteApi, getApiList}
    } = this.props;

    deleteApi(appData.id, apiData.id)
      .then(res => {
        if(!res.error) {
          message.success('Delete API successfully.');
          getApiList(appData.id);
        }
      });
  },

  onCancelApp() {
    this.setState({appModalVisible: false});
  },

  onMenuClick(item) {
    item.key === 'ADD-APP' ? this.onAddApp() : hashHistory.push(item.key);
  },

  onMessage(e) {
    var msg = e.data;
    if(/^expandApp/.test(msg)) {
      var appId = msg.split('-').pop();
      this.onExpandApp([appId]);
    }
  },

  componentDidMount() {
    window.addEventListener('message', this.onMessage);
  },

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  },

  getAppMenu(app) {
    return (
      <Menu className="ant-dropdown-menu-right">
        <Menu.Item>
          <a href="javascript:;" onClick={() => this.onAddApi(app)}><Icon type="plus" /> Add API</a>
        </Menu.Item>
        <Menu.Item>
          <a href="javascript:;" onClick={() => this.onEditApp(app)}><Icon type="edit" /> Edit Application</a>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm title="Are you sure delete this application?" placement="rightTop"
                      onConfirm={() => this.onDeleteApp(app)} okText="Yes" cancelText="No">
            <a href="javascript:;" onClick={e=>e.stopPropagation()}><Icon type="delete" /> Delete Application</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item>
          {/* @todo */}
          <span href="javascript:;" className="text-muted"><Icon type="export" /> Export Document</span>
        </Menu.Item>
      </Menu>
    );
  },

  getApiMenu(app, api) {
    return (
      <Menu className="ant-dropdown-menu-right">
        <Menu.Item>
          <Popconfirm title="Are you sure delete this API?" placement="rightTop"
                      onConfirm={() => this.onDeleteApi(app, api)} okText="Yes" cancelText="No">
            <a href="javascript:;" onClick={e=>e.stopPropagation()}><Icon type="delete" /> Delete API</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Item>
          {/* @todo */}
          <span href="javascript:;" className="text-muted"><Icon type="play-circle-o" /> Run Test</span>
        </Menu.Item>
      </Menu>
    );
  },

  render() {
    var {
      location, params, apps: {appList, apiCollection, groupList, currentGroupId}
    } = this.props;
    var {appModalVisible, currentApp} = this.state;

    return (
      <span>
        <AppModal visible={appModalVisible}
                  groupList={groupList} appData={currentApp}
                  currentGroupId={currentGroupId}
                  onCancel={this.onCancelApp}
                  onOk={this.onSaveApp} />
        <Menu className={`w250 ${STYLE.appMenu}`}
              onClick={this.onMenuClick}
              selectedKeys={[location.pathname]}
              defaultOpenKeys={[params.appId]}
              onOpenChange={this.onExpandApp}
              mode="inline">
          {
            appList === undefined ?
              <div className="text-center"><Spin /></div> :
              appList.map(app => {
                if(currentGroupId && app.group != currentGroupId) {
                  return null;
                }
                const title = (
                  <div>
                    <Badge status={app.enabled ? 'success': 'default'}/>
                    <span className="vertical-middle">{app.name}</span>
                    <Dropdown trigger={['click']} overlay={this.getAppMenu(app)}>
                      <Icon onClick={e => e.stopPropagation()} className="app-control" type="ellipsis"/>
                    </Dropdown>
                  </div>
                );

                return (
                  <SubMenu key={app.id} title={title}>
                    {
                      apiCollection[app.id] === undefined ?
                        <div className="text-center"><Spin /></div> :
                        apiCollection[app.id].length ?
                          apiCollection[app.id].map(api => {
                            return (
                              <Menu.Item key={getApiPath(app.id, api.id, currentGroupId)}>
                                <Method type={api.method} disabled={!api.enabled}/>
                                <span className={api.enabled ? '' : 'text-muted'}>{api.name}</span>
                                <Dropdown trigger={['click']} overlay={this.getApiMenu(app, api)}>
                                  <Icon onClick={e => e.stopPropagation()} className="app-control" type="ellipsis"/>
                                </Dropdown>
                              </Menu.Item>
                            )
                          }) :
                          <div className="text-center text-muted">No api in this application</div>
                    }
                  </SubMenu>
                )
              })
          }
          <Menu.Item key="ADD-APP" className={STYLE.addApp} onClick={this.onAddApp}><Icon type="plus"/><span>Add Application</span></Menu.Item>
        </Menu>
      </span>
    )
  }

});

// connect action to props
const mapStateToProps = ({apps, root}) => ({apps, root});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators({...appsActions, ...rootActions}, dispatch)});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppMenu);