const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const contactsRouter = require('./contacts/contactsRouter');
const userRouter = require('./users/usersRouter');

require('dotenv').config();

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
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
    this.server.use('/api/users', userRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Database connection successful');
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  startListening() {
    const PORT = process.env.PORT;
    this.server.listen(PORT, err => {
      err ? console.error(err) : console.log(`Start listening at port ${PORT}`);
    });
  }
};
