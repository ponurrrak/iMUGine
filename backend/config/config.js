module.exports = {
  port: process.env.PORT || 8000,
  mongoUrl: process.env.IMUGINE_DB_URL || 'mongodb://localhost:27017/imugine',
  corsOptions: {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  },
};
