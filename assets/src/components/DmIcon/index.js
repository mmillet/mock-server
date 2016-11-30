import React from 'react';
import classnames from 'classnames';

const DmIcon = React.createClass({

  render() {
    var props = {...this.props};
    props.className = classnames(`dm-icon dm-icon-${props.type}`, props.className);
    return <i {...props}></i>;
  }
});

export default DmIcon;

