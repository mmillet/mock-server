# mock-server
  
  A simple mock server, more easy to deploy and easy to use. It is base on [express](https://github.com/expressjs/express) and [ant-design](https://github.com/ant-design/ant-design).
  
![DEMO](http://imgcache.dealmoon.com/thumbimg.dealmoon.com/dealmoon/637/9ca/b47/8900c3f1eaaab2a3af8e0fc.png_1400_0_3_51dd.png)

## Requirement
Node >= 6.0.0

## Get Start
### How to setup ?
First of all, get the code from github.
```
git clone https://github.com/mmillet/mock-server.git
```
Then copy data_template to data path and install dependences.
```
cd mock-server
cp data_template data -r
npm install && npm run build
```
Now you can run server like this. You can manage APIs at http://localhost:9999/~m (default auth is: ```user / 123456```).
```
node ./server.js 9999
```

### How to develop me ?
You can run dev_server (express) and webpack_dev_server (frontend) with this command.
```
npm run dev
```

## FAQ
Q: How to modify auth?  
A: Modify  manageUsername/managePassword values in ```./data/settings.json```.

Q: Can I run with pm2?  
A: Of course, you can run server by other node process manager, like [pm2](https://github.com/Unitech/pm2). If you have installed pm2, try to start server by ```npm run server```. Good Luck!

Q: Where are the APIs stored?  
A: They are stored ```./data``` path, if you want to create backup files, just copy this path.

