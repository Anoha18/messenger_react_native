module.exports = {
  SERVER: {
    HOST: 'localhost',
    PORT: 3000
  },
  JWT: {
    ACCESS_JWT_SECRET: 'ACCESS_SECRET',
    REFRESH_JWT_SECRET: 'REFRESH_SECRET',
    REFRESH_JWT_LIFE: '365d',
    ACCESS_JWT_LIFE: '1h'
  },
  DB: {
    NAME: 'messenger',
    USER: 'postgres',
    PASSWORD: 'Y4nMWpdOU1F1NkpcwCQnQRWxHSxOCP',
    HOST: 'postgres',
    PORT: 5432
  },
  SOCKET: {
    PATH: '/socket'
  }
};
