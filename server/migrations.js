const { DB } = require('./src/config');

module.exports = {
  dev: {
    driver: 'pg',
    user: DB.USER,
    password: DB.PASSWORD,
    host: DB.HOST,
    database: DB.NAME,
    port: DB.PORT,
    schema: 'public'
  }
};
