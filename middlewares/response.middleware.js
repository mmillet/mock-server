/**
 * Created by zhengguo.chen on 16/11/23.
 */

module.exports = (req, res, next) => {
  res.success = data => res.json({code: 200, data: data});
  res.fail = (e, code) => res.json({code: code || 500, msg: e instanceof Error ? e.message : e});
  res.handleResult = promise => {
    return promise
      .then(result => res.success(result))
      .catch(err => {
        console.error(err, err.stack);
        return res.fail(err);
      });
  };
  next();
};

