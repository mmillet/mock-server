import React from "react";
import {connect} from "react-redux";
import {hashHistory} from 'react-router';
import {bindActionCreators} from "redux";
import {Icon, Menu} from "antd";
import rootActions from "actions/root";
import PageLoading from "components/PageLoading";
import Ceiling from "components/Ceiling";
import GroupsTab from "../Groups/GroupsTab";
import "./style.less";

var App = React.createClass({

	render() {
		let {root, children, location} = this.props;

		return (
			<div className="page-wrapper">
				{root.pageLoading && <PageLoading />}

				<Ceiling/>

				<div className="ant-layout-subheader">
					<div className="ant-layout-wrapper">
						<GroupsTab />
					</div>
				</div>

				{children}
			</div>
		);
	}
});


const mapStateToProps = ({root}) => ({root});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(rootActions, dispatch)});


export default connect(mapStateToProps,mapDispatchToProps)(App);
