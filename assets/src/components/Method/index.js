/**
 * Created by zhengguo.chen on 16/11/25.
 */


import React from 'react';
import classnames from 'classnames'
import STYLE from './style.less';

const Method = React.createClass({

  render() {
    var props = {...this.props};
    var {type = 'GET', disabled = false} = props;

    props.className = classnames(STYLE.method, disabled ?  STYLE.disabled : STYLE[type], props.className);
    return <i {...props}>{type}</i>;
  }
});

export default Method;
