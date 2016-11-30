/**
 * Created by zhengguo.chen on 16/11/25.
 */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import appsActions from 'actions/apps';
import rootActions from 'actions/root';

import STYLE from './style.less';
import {
  Spin, Icon, Button, Select, Input,
  Tabs, Form, Switch, InputNumber,
  Col
} from 'antd';
const FormItem = Form.Item;
const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

var Settings = React.createClass({

  getInitialState() {
    return {
      loading: false,
      api: {}
    }
  },

  render() {
    return (
      <div className={STYLE.main}>
        <Spin spinning={false}>
          <Form horizontal className={`${STYLE.form} margin-vertical`}>
            <FormItem
              {...formItemLayout}
              label="Reset Password">
              <Input type="password" placeholder="Current Password" />
            </FormItem>

            <FormItem wrapperCol={{ span: 14, offset: 6 }}>
              <Input type="password" placeholder="New Password" />
            </FormItem>

            <FormItem wrapperCol={{ span: 14, offset: 6 }}>
              <Input type="password" placeholder="Confirm Password" />
            </FormItem>

            <FormItem wrapperCol={{ span: 14, offset: 6 }}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </FormItem>
          </Form>
        </Spin>
      </div>

    )
  }
});

// connect action to props
const mapStateToProps = ({apps, root}) => ({apps, root});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators({...appsActions, ...rootActions}, dispatch)});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);