/**
 * Created by zhengguo.chen on 16/11/29.
 */
import React from 'react';
import classnames from 'classnames'
import STYLE from './style.less';

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';

import {APP_INITIAL_DATA} from 'constants/config';

import {Modal, Tabs, Form, Input, Switch} from "antd";
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const getInitialAppData = () => APP_INITIAL_DATA;


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const AppModal = React.createClass({

  getInitialState() {
    return {
      currentTab: '1',
      // initial app data
      appData: {},
      error: {}
    }
  },

  onAppChange(field, value) {
    this.setState({
      appData: Object.assign({}, this.state.appData, {[field]: value})
    });
  },

  onChangeTab(currentTab) {
    this.setState({currentTab});
  },

  onHandleOk() {
    if(this.onValidate()) {
      this.props.onOk(this.state.appData);
    }
  },

  onValidate() {
    var {appData} = this.state;
    var isValid = true;
    var error = {};
    if(appData.name == '') {
      error.name = 'Name should not be null.';
      isValid = false;
    }
    if(appData.apiPrefix == '') {
      error.apiPrefix = 'Api Prefix should not be null.';
      isValid = false;
    }
    this.setState({error});
    return isValid;
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible) {
      this.setState({
        currentTab: '1',
        appData: nextProps.appData || getInitialAppData(),
        error: {}
      });
    }
  },

  render() {
    var {visible, onOk, onCancel} = this.props;
    var {currentTab, appData, error} = this.state;
    return (
      <Modal title={appData.id ? 'Edit Application' : 'Add Application'} visible={visible}
             onOk={this.onHandleOk} onCancel={onCancel}
             okText="OK"
             cancelText="Cancel"
      >
        <Tabs activeKey={currentTab} onChange={this.onChangeTab}>
          <TabPane tab="Setting" key="1">
            <Form horizontal>
              <FormItem
                {...formItemLayout}
                validateStatus={error.name ? 'error': ''}
                help={error.name ? error.name: ''}
                label="Name"
              >
                <Input ref="name" value={appData.name} onChange={e => this.onAppChange('name', e.target.value)}/>
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Description"
              >
                <Input value={appData.description} type="textarea" autosize={{ minRows: 2, maxRows: 6 }} onChange={e => this.onAppChange('description', e.target.value)}/>
              </FormItem>

              <FormItem
                {...formItemLayout}
                validateStatus={error.apiPrefix ? 'error': ''}
                help={error.apiPrefix ? error.apiPrefix: ''}
                label="API Prefix"
              >
                <Input value={appData.apiPrefix} onChange={e => this.onAppChange('apiPrefix', e.target.value)}/>
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="Enabled"
              >
                <Switch checked={appData.enabled} onChange={v => this.onAppChange('enabled', v)}/>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="Response Template" key="2">
            <AceEditor
              value={typeof appData.responseTemplate === 'string' ? appData.responseTemplate : ''}
              mode="javascript"
              theme="github"
              name="response_template_ace"
              tabSize={2}
              style={{height: 257}}
              editorProps={{$blockScrolling: true}}
              onChange={v => this.onAppChange('responseTemplate', v)}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
});


export default AppModal;

