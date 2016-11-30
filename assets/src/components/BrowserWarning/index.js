/**
 * Created by zhengguo.chen on 16/8/1.
 */

import React from 'react';

import { Alert } from 'antd';


export default React.createClass({

  componentDidMount() {
    
  },

  render() {
    return (
      <div className="margin-sm">
        <Alert message={<span>
                          您的浏览器版本太低啦，可能无法正常使用某些功能，请<a href="http://browsehappy.com/" target="_blank">升级浏览器</a>。
                        </span>
                }
               type="warning" showIcon/>
      </div>
    );
  }
});
