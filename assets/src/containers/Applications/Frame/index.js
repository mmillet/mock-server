import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import appsActions from "actions/apps";
import rootActions from "actions/root";

import AppMenu from './AppMenu';

var Frame = React.createClass({

	onGetAppList(keys) {
		const {
			apps: {apiCollection},
			actions: {getApiList}
		} = this.props;

		console.log(keys);

		keys.forEach(key => {
			if(key !== undefined && apiCollection[key] === undefined) {
				getApiList(key);
			}
		});
	},

	componentDidMount() {
		this.props.actions.getAppList();
	},

	render() {
		const {
			apps: {appList, apiCollection},
			children,
			location, params
		} = this.props;

		return (
			<div className="page-content-wrapper reset">
				<div className="sidebar pull-left">
					<AppMenu params={params} location={location} appList={appList} apiCollection={apiCollection} onGetAppList={this.onGetAppList}/>
				</div>
				<div className="page-content">
					{children}
				</div>
			</div>
		);
	}
});

// connect action to props
const mapStateToProps = ({apps, root}) => ({apps, root});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators({...appsActions, ...rootActions}, dispatch)});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Frame);
