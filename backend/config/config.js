module.exports = {
  port: process.env.PORT || 8000,
  mongoUrl: process.env.IMUGIN_DB_URL || 'mongodb://localhost:27017/bulletinBoard',
  corsOptions: {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  },
};
