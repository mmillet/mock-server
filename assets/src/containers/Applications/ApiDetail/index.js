/**
 * Created by zhengguo.chen on 16/11/25.
 */

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Modal} from 'antd';
import request, {METHODS} from 'utils/request';
import appsActions from 'actions/apps';
import rootActions from 'actions/root';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/github';

import isEqual from 'is-equal-shallow';

import {forEach} from 'lodash';

import {HTTP_STATUS} from 'constants/config';


import {
  Row, Col,
  Spin, Icon, Button, Select, Input,
  Tabs, Form, Switch, InputNumber,
  Slider, AutoComplete, Card, Badge,
  message
} from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

import * as STYLE from './style.less';

const UPDATE_SUCCESS = 'Update api successfully!';
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const ACE_HEIGHT = window.innerHeight - 316;

var ApiDetail = React.createClass({

  getInitialState() {
    return {
      loading: false,
      api: {},
      _api: {} // 用于比较
    }
  },

  onSave() {
    const {
      params: {appId, apiId},
      actions: {getApiList, updateApi}
    } = this.props;
    var {api, _api} = this.state;
    var modified = {};

    forEach(api, (v, k) => {
      if(v != _api[k]) {
        modified[k] = v;
      }
    });

    this.setState({loading: true});
    updateApi(appId, apiId, modified).then(res => {
      if(!res.error) {
        this.setState({
          loading: false,
          api: res.payload,
          _api: res.payload
        }, () => {
          message.success(UPDATE_SUCCESS);
          // if name or method changed, refresh api list
          if(modified.method !== undefined || modified.name !== undefined || modified.enabled !== undefined) {
            getApiList(appId);
          }
        });
      } else {
        this.setState({
          loading: false
        });
      }
    });

  },

  hasChanged() {
    var {api, _api} = this.state;
    return !isEqual(api, _api);
  },

  onApiChange(type, v, ele) {
    this.setState({
      api: Object.assign({}, this.state.api, {[type]: v})
    }, () => {
      // Input auto size
      if(type == 'name' || type == 'description' && ele) {
        this._autoInputWidth();
      }
    });
  },

  onNameBlur(v) {
    v == '' && this.onApiChange('name', 'API NAME');
  },

  onGetApi(appId, apiId) {
    this.setState({loading: true});
    const {
      apps: {apiCollection, appList, currentGroupId},
      actions: {getApiList, getApi}
    } = this.props;

    if(apiCollection[appId] === undefined) {
      getApiList(appId);
    }

    getApi(appId, apiId).then(res => {
      if(res.error) {
        this.setState({loading: false, api: {}, _api: {}});
      } else {
        this.setState({loading: false, api: res.payload, _api: res.payload}, this._autoInputWidth);
      }
    });
  },

  onGetRequest(apiPrefix, api) {
    var {url, request: requestData} = api;

    if(this.hasChanged()) {
      message.error('Please save api to run test');
      return ;
    }

    try {
      eval(`requestData = ${requestData}`); // todo remove unsafe eval
    } catch (e) {
      requestData = null;
    }

    request(apiPrefix + url, requestData, METHODS[api.method], true, false).then(respPromise => {
      return respPromise.text().then(resp => {
        try {
          resp = JSON.stringify(JSON.parse(resp), null, 2);
        } catch (e) {}
        const onRefresh = () => {
          modal && modal.destroy();
          this.onGetRequest(apiPrefix, api);
        };

        var modal = Modal[respPromise.status === 200 ? 'success' : 'error']({
          width: 750,
          okText: 'OK',
          content: <span>
            <strong>{api.method}</strong> {apiPrefix + url}
            <strong className="ml10">{respPromise.status} {respPromise.statusText}</strong>
            <Button className="ml10 mb10" onClick={onRefresh} size="small" shape="circle" type="ghost" icon="reload" />
            <br/>
            <pre className={STYLE.preview}
                 dangerouslySetInnerHTML={{__html: resp}}></pre>
          </span>,
        });

        return resp;
      });
    })
  },

  componentDidMount() {
    const {
      params: {appId, apiId, groupId},
      actions
    } = this.props;

    this.onGetApi(appId, apiId);

    if(groupId) {
      actions.selectGroup(groupId);
    }
  },
  componentWillReceiveProps(nextProps) {
    const {
      params: {appId, apiId}
    } = this.props;
    const newParams = nextProps.params;

    if(appId != newParams.appId || apiId != newParams.apiId) {
      console.info('I WILL GET API');
      this.onGetApi(newParams.appId, newParams.apiId);
    }
  },

  _autoInputWidth() {
    this.setState({
      nameWidth: this.refs._name.offsetWidth + 18,
      descWidth: this.refs._desc.offsetWidth + 18,
    });
  },

  render() {
    const {
      apps: {appList, appMap},
      params: {appId, apiId},
    } = this.props;
    const {
      loading,
      api,
      nameWidth, descWidth
    } = this.state;
    const appInfo = (appMap && appMap[appId]) ? appMap[appId] : {};

    const rateMarks = {
      0: {
        style: {
          color: '#87d068',
        },
        label: <strong>0%</strong>,
      },
      50: {
        style: {
          color: '#fa0',
        },
        label: <strong>50%</strong>,
      },
      100: {
        style: {
          color: '#f50',
        },
        label: <strong>100%</strong>,
      },
    };

    let hasChanged = this.hasChanged();

    return (
      <Spin spinning={loading}>
        <div className="mb30">

          <div className={STYLE.head}>
            <div className={STYLE.title}>
              <Input className={STYLE.name}
                     maxLength={128}
                     style={{width: api.name ? nameWidth: 0}}
                     size="large"
                     onBlur={e => this.onNameBlur(e.target.value)}
                     onChange={e => this.onApiChange('name', e.target.value, e.target)}
                     value={api.name}/>

              <div className={STYLE._name} ref="_name">{api.name}</div>

              <Input className={STYLE.desc}
                     maxLength={256}
                     style={{width: descWidth}}
                     size="small"
                     onChange={e => this.onApiChange('description', e.target.value, e.target)}
                     placeholder="API Description..."
                     value={api.description}/>

              <div className={STYLE._desc} ref="_desc">{api.description}</div>

            </div>

            <div className={STYLE.control}>
              <Switch className="mr10" checked={api.enabled} onChange={v => this.onApiChange('enabled', v)}/>
              <Badge dot={hasChanged}>
                <Button type="ghost" icon="hdd" disabled={!hasChanged} onClick={this.onSave}>Save</Button>
              </Badge>
            </div>
          </div>

          <div className={STYLE.url}>
            <div className={STYLE.method}>
              <Select size="large" value={api.method} style={{width: '100%'}} onChange={v => this.onApiChange('method', v)}>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="PATCH">PATCH</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="ALL">ALL</Option>
              </Select>
            </div>
            <div className={STYLE.input}>
              <Input size="large" maxLength={256}
                     onChange={e => this.onApiChange('url', e.target.value)}
                     addonBefore={appInfo.apiPrefix || ' '}
                     value={api.url}/>
            </div>
            <div className={STYLE.run}>
              <Button size="large" htmlType="submit" type="ghost" onClick={e => this.onGetRequest(appInfo.apiPrefix, api)}>
                Run Test
              </Button>
            </div>
          </div>

          <Row gutter={12}>

            <Col className="gutter-row" span={14}>
              <Card>
                <div className="response">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Response" key="1">
                      <AceEditor
                        value={typeof api.response === 'string' ? api.response : ''}
                        mode="javascript"
                        theme="github"
                        name="response_ace"
                        wrapEnabled={true}
                        tabSize={2}
                        height={ACE_HEIGHT}
                        width={'100%'}
                        showPrintMargin={false}
                        editorProps={{$blockScrolling: true}}
                        onChange={v => this.onApiChange('response', v)}
                      />
                    </TabPane>
                  </Tabs>
                </div>
              </Card>
            </Col>

            <Col className="gutter-row" span={10}>
              <Card>
              <div className="request">

                <Tabs defaultActiveKey="1">
                  <TabPane tab="Request" key="1">
                    <AceEditor
                      value={typeof api.request === 'string' ? api.request : ''}
                      mode="javascript"
                      theme="github"
                      name="request_ace"
                      wrapEnabled={true}
                      tabSize={2}
                      height={ACE_HEIGHT}
                      width={'100%'}
                      showPrintMargin={false}
                      editorProps={{$blockScrolling: true}}
                      onChange={v => this.onApiChange('request', v)}
                    />
                  </TabPane>

                  <TabPane tab="Setting" key="2">
                    <Form horizontal style={{height: ACE_HEIGHT}}>
                      <FormItem
                        {...formItemLayout}
                        label="Delay"
                      >
                        <InputNumber value={api.delay} onChange={v => this.onApiChange('delay', v)} style={{width: 80}} min={0} max={100000} step={100}/>
                        <span className="ant-form-text"> ms (0 ~ 100000)</span>
                      </FormItem>

                      <FormItem
                        {...formItemLayout}
                        label="Http Status"
                      >
                        <AutoComplete value={api.successStatus} placeholder="Success" onChange={v => this.onApiChange('successStatus', v)} style={{width: 80, float: 'left'}} dataSource={HTTP_STATUS} />
                        <AutoComplete value={api.failStatus} placeholder="Fail" onChange={v => this.onApiChange('failStatus', v)} style={{width: 80, marginLeft: 10, float: 'left'}} dataSource={HTTP_STATUS} />
                      </FormItem>

                      <FormItem
                        {...formItemLayout}
                        label="Fail Rate"
                      >
                        <Slider value={api.failRate} onChange={v => this.onApiChange('failRate', v)} marks={rateMarks} defaultValue={0} tipFormatter={v => `${v}%`} />
                      </FormItem>



                    </Form>
                  </TabPane>

                </Tabs>
              </div>
              </Card>
            </Col>

          </Row>
        </div>
      </Spin>
    )
  }
});

// connect action to props
const mapStateToProps = ({apps, root}) => ({apps, root});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators({...appsActions, ...rootActions}, dispatch)});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApiDetail);