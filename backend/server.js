const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const { corsOptions, mongoUrl, port } = require('./config/config');

const productsRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const publicDirPath = path.join(__dirname, '../build');

const app = express();

/* MONGOOSE */
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log('Successfully connected to the database');
});
db.on('error', err => console.log('Error: ' + err));

/* MIDDLEWARE */
app.use(session({
  secret: process.env.sessionSecret,
  store: MongoStore.create({ mongoUrl }),
}));

if(process.env.NODE_ENV !== 'production') {
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* API ENDPOINTS */
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

/* API ERROR PAGES */
app.use('/api', (req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

/* REACT WEBSITE */
app.use(express.static(publicDirPath));
app.use('*', (req, res) => {
  res.sendFile(path.join(publicDirPath, 'index.html'));
});

/* START SERVER */
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});
