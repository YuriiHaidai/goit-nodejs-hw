const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routers/contactsRouter');

module.exports = class UsersServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(morgan('tiny'));
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use('/api/contacts', contactsRouter);
  }

  startListening() {
    this.server.listen(3000, err => {
      err ? console.error(err) : console.log('Start listening at port 3000');
    });
  }
};
