/**
 * Created by zhengguo.chen on 2017/12/22.
 */

import React from "react";
import _ from "lodash";
import classnames from "classnames";
import {connect} from "react-redux";
import {hashHistory} from 'react-router';
import {bindActionCreators} from "redux";
import {Icon, Select} from "antd";
import appsActions from "actions/apps";
import STYLE from "./style.less";

const { Option, OptGroup } = Select;

var SelectAppAndGroup = React.createClass({

  getInitialState() {
    this.onSearch = _.debounce(this.onSearch, 200);

    return {
      filterGroups: [],
      filterApps: []
    }
  },

  onSearch(keyword) {
    var { apps } = this.props;
    keyword = (keyword || '').toLowerCase();
    var filterGroups = keyword ? _.filter(apps.groupList, group => {
      return group.name && group.id && group.name.toLowerCase().indexOf(keyword) !== -1
    }) : [];
    var filterApps = keyword ? _.filter(apps.appList, app => {
      return (
        (app.name && app.name.toLowerCase().indexOf(keyword) !== -1) ||
        (app.apiPrefix && app.apiPrefix.toLowerCase().indexOf(keyword) !== -1)
      )
    }) : [];
    this.setState({
      keyword,
      filterGroups,
      filterApps
    });
  },

  onSelect(data) {
    var [type, id] = data.split('-');
    this.props.onSelect && this.props.onSelect(type, id);
  },

  render() {
    var {keyword, filterGroups, filterApps} = this.state;
    return <div className={STYLE.search}>
      <Icon className={STYLE.searchIcon} type="search" />
      <Select
        placeholder="Search Group and APP"
        size="large"
        showSearch={true}
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        showArrow={false}
        filterOption={false}
        notFoundContent={keyword ? 'Not Found' : 'Input some keywords to search'}
      >
        <OptGroup label="Groups">
          {
            filterGroups.map(group => <Option value={`group-${group.id}`} label={{type: 'group', id: group.id}}>{group.name}</Option>)
          }
        </OptGroup>
        <OptGroup label="Applications">
          {
            filterApps.map(app => <Option value={`app-${app.id}`} label={{type: 'app', id: app.id}}>{app.name} {app.apiPrefix}</Option>)
          }
        </OptGroup>
      </Select>
    </div>
  }
});


const mapStateToProps = ({apps}) => ({apps});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(appsActions, dispatch)});

export default connect(mapStateToProps,mapDispatchToProps)(SelectAppAndGroup);