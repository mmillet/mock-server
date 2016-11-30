/**
 * Created by zhengguo.chen on 16/7/18.
 */
import React from 'react';
import * as STYLE from './style.less';

var Ceiling = React.createClass({

  render() {
    var {email = 'xxx@example.com'} = this.props;

    return (
      <div className="ant-layout-ceiling-wrapper">
        <div className="ant-layout-ceiling">
          <div className="ant-layout-wrapper">
            <ul className="right">
              <li>Dealmoon API Mock Tools</li>
              <li>|</li>
              <li>Help</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
})

export default Ceiling;