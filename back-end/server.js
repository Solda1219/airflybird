const https = require('https');
const fs = require('fs');
const app = require("./app");
const setting = require("./config/setting");
const sys_initapp = require("./app/controller/setting_system");

const options = {
  key: fs.readFileSync('./cert/private.key'),
  cert: fs.readFileSync('./cert/ca-bundle.crt')
};

if (require.main === module) {
  setting.sqlDriver.connect((err) => {
    if (err) throw err;
    console.log('My sql connected!');
    sys_initapp.system_exe();
  });
  // https.createServer(options, app).listen(setting.port, () => {
  //   console.log('server is working on port:' + setting.port)
  // });
  app.listen(setting.port, ()=> {
    console.log('server is working on port:'+setting.port)
  });
}
