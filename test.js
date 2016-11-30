var a = `function(req, res, next){
  console.log(req);
  return {
    success: 123
  };
}`;

var resp = null;
eval('resp = ' + a);

console.log(resp());