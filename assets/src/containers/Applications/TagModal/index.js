/**
 * Tag modal
 * Created by zhengguo.chen on 18/06/11.
 */

import React from 'react';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import request, {METHODS} from 'utils/request';
import appsActions from 'actions/apps';
import rootActions from 'actions/root';

import {API_CURRENT_TAG} from 'constants/config';

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/diff';
import 'brace/theme/github';
import isEqual from 'is-equal-shallow';
import {forEach} from 'lodash';

import {Modal, Select, Spin, Popconfirm, message} from 'antd';
const Option = Select.Option;

import STYLE from './style.less';


var TagModal = React.createClass({

  getInitialState() {
    return {
      selectTag: '',
      loading: false,
      content: '',
    }
  },

  onChangeTag(tag, item) {
    var {actions, tags, appId, apiId} = this.props;
    this.setState({selectTag: tag});
    var index = _.findIndex(tags, _tag => tag === _tag);
    var tagPrev = tags[index + 1] || '';
    this.setState({loading: true});
    actions.getApiTagDiff(appId, apiId, {tag, tagPrev}).then(res => {
      this.setState({loading: false});
      if(!res.error) {
        this.setState({content: res.payload});
      }
    });
  },

  onDeleteTag() {
    var {actions, appId, apiId, onDeleteTag = () => {}} = this.props;
    var {selectTag} = this.state;
    actions.deleteApiTag(appId, apiId, selectTag).then(res => {
      if(!res.error) {
        message.success('Delete tag successfully!');
        onDeleteTag();
      }
    });
  },

  componentDidMount() {
    var {tags} = this.props;
    this.onChangeTag(tags[0]);
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.tags !== nextProps.tags) {
      this.setState({selectTag: nextProps.tags[0]});
    }
  },

	render() {
    var {root, tags, ...props} = this.props;
    var {selectTag, content, loading} = this.state;

		return (
      <Modal 
        visible={true}
        title="Api Tag Diff"
        width={740}
        footer={null}
        {...props}
      >
        <div className={STYLE.head} ref="head">
          <span>Select to diff: </span>
          <Select style={{width: 200}} value={selectTag} onChange={this.onChangeTag}>
            {
              tags.map((tag, index) => {
                return <Option key={tag} value={tag}>{tag}{index === 0 ? ' (Current)' : ''}</Option>
              })
            }
          </Select>
          {
            selectTag !== API_CURRENT_TAG ? 
            <Popconfirm 
              getTooltipContainer={() => this.refs.head}
              title={<span>Are you sure to delete tag <strong>{selectTag}</strong> ?</span>} placement="rightTop"
              onConfirm={this.onDeleteTag} okText="Yes" cancelText="No">
              <a>Delete</a>
            </Popconfirm> : null
          }
        </div>
        <Spin spinning={loading}>
          <div className={STYLE.content}>
            <AceEditor
              value={content || 'Nothing changed'}
              mode="diff"
              theme="github"
              name="diff_ace"
              showGutter={false}
              readOnly={true}
              wrapEnabled={true}
              tabSize={1}
              height={600}
              width={'100%'}
              showPrintMargin={false}
              editorProps={{$blockScrolling: true, cursorStyle: 'smooth'}}
              setOptions={{displayIndentGuides: false}}
            />
          </div>
        </Spin>
			</Modal>
		);
	}
});


const mapStateToProps = ({root}) => ({root});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators({...appsActions, ...rootActions}, dispatch)});

export default connect(mapStateToProps, mapDispatchToProps)(TagModal);
