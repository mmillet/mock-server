/**
 * Created by zhengguo.chen on 17/4/24.
 */

import React from "react";
import classnames from "classnames";
import {connect} from "react-redux";
import {hashHistory} from 'react-router';
import {bindActionCreators} from "redux";
import {Icon, Tabs, Spin, Popover, Input, message, Button, Popconfirm} from "antd";
import appsActions from "actions/apps";
import STYLE from "./style.less";

import SelectAppAndGroup from './SelectAppAndGroup';

const TabPane = Tabs.TabPane;
const ButtonGroup = Button.Group;

var GroupsTab = React.createClass({
  getInitialState() {
    return {
      loading: false,
      edit: false,
      name: ''
    }
  },

  componentDidMount() {
    let {actions} = this.props;
    actions.getGroupList();
  },

  onChange(groupId) {
    let {actions} = this.props;
    actions.selectGroup(groupId);
  },

  onInput(e) {
    this.setState({name: e.target.value});
  },

  onVisible() {
    this.setState({visible: true});
  },

  onToggleEdit() {
    this.setState({edit: !this.state.edit});
  },

  onSearchSelect(type, id) {
    let {actions} = this.props;
    if(type === 'group') {
      actions.selectGroup(id);
    } else if(type === 'app') {
      actions.selectGroup('');
      setTimeout(() => {
        window.postMessage(`expandApp-${id}`, '*');
      }, 300);
    }
  },

  onCreateGroup() {
    let {actions} = this.props;
    let {name, loading} = this.state;
    if(loading || !name) {
      return;
    }
    this.setState({loading: true});
    actions.createGroup({name}).then(res => {
      if(!res.error) {
        var groupId = res.payload.id;
        message.success('Add group successfully!');
        actions.getGroupList().then(res => {
          setTimeout(() => {
            actions.selectGroup(`${groupId}`);
          }, 300);
        });
        this.setState({name: ''});
      }
      this.setState({loading: false});
    });
  },

  onDeleteGroup(groupId) {
    let {actions} = this.props;
    this.setState({loading: true});
    actions.deleteGroup(groupId).then(res => {
      if(!res.error) {
        var groupId = res.payload.id;
        message.success('Delete group successfully!');
        actions.getGroupList();
      }
      this.setState({loading: false});
    });
  },

  onVisibleChange(visible) {
    if(visible) {
      setTimeout(() => {
        this.refs.nameInput && this.refs.nameInput.refs.input.focus();
      }, 200);
    }
  },

  render() {
    let {apps} = this.props;
    let {name, edit, loading} = this.state;

    const controls = <ButtonGroup>
      <Popover placement="bottomRight"
               style={{marginLeft: 10}}
               onVisibleChange={this.onVisibleChange}
               trigger="click"
               content={
                 <Spin spinning={loading}>
                   <Input value={name} onChange={this.onInput}
                          onPressEnter={this.onCreateGroup}
                          ref="nameInput"
                          placeholder="New Group Name"/>
                 </Spin>
               }>
        <Button type="ghost"><Icon type="plus" /></Button>
      </Popover>
      <Button onClick={this.onToggleEdit} type={edit ? 'primary': 'ghost'}><Icon type="edit" /></Button>
    </ButtonGroup>;


    const getGroupName = group => <span className={STYLE.groupName}>
      {group.id !== '' ?
        <a href="javascript:;" onClick={e=>e.stopPropagation()}>
          <Popconfirm title={<span>Are you sure to delete this group ？<br/>(This action will not remove application)</span>} placement="rightTop"
                      onConfirm={() => this.onDeleteGroup(group.id)} okText="Yes" cancelText="No">
            <Icon type="close-circle-o"/>
          </Popconfirm>
        </a> : null
      }
      {group.name}
    </span>

    return (
      <div className={classnames('ant-layout-wrapper', STYLE.menu, {[STYLE.isEdit]: edit})}>
        <SelectAppAndGroup onSelect={this.onSearchSelect}/>
        <Tabs className={STYLE.tabs}
              mode="horizontal"
              tabBarExtraContent={controls}
              onChange={this.onChange} activeKey={apps.currentGroupId}>
          {
            (apps.groupList).map(group => {
              return <TabPane tab={getGroupName(group)} key={group.id}></TabPane>
            })
          }
        </Tabs>
        {
          apps.groupList.length ? null : <Spin />
        }
      </div>
    );
  }
});


const mapStateToProps = ({apps}) => ({apps});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(appsActions, dispatch)});


export default connect(mapStateToProps,mapDispatchToProps)(GroupsTab);
