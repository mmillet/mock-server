import ReactDOM from "react-dom";
import React from "react";
import {Provider} from "react-redux";
import configure from "./store";
import {Router, Route, IndexRedirect, hashHistory} from "react-router";

import Frame from "./containers/Frame";
import NotFound from "./containers/NotFound";

import ApplicationsFrame from "./containers/Applications/Frame";
import ApiDetail from './containers/Applications/ApiDetail';
import Settings from './containers/Settings';



// Root store
var store = configure();

// Main router
ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
			<Route path="/" component={Frame}>
				<IndexRedirect to="apps"/>

				{/*Dashboard*/}
				<Route path="apps" component={ApplicationsFrame}>
					{/*<IndexRedirect to="apps"/>*/}
					<Route path=":appId/api/:apiId" component={ApiDetail} />
				</Route>

				{/*信用卡*/}
				<Route path="settings" component={Settings} />

				{/*404*/}
				<Route path="*" component={NotFound}/>

			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);
