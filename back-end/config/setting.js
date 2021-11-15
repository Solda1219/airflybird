const mysql = require('mysql');

module.exports = {
  port: process.env.PORT || 80,
  sqlDriver: mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'china_lin'
  }),
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret',
    expiry: '365d'
  },
  superAdmin: '13478915888'
};
