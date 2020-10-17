const Joi = require('joi');
const userModel = require('./usersModel');
const {
  Types: { ObjectId },
} = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UsersController {
  constructor() {
    this._costFactor = 4;
  }

  get register() {
    return this._register.bind(this);
  }

  validateRegisterAndLogin(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().min(5).required(),
      password: Joi.string().min(3).required(),
      subscription: Joi.string(),
    });

    const validation = userRules.validate(req.body);
    if (validation.error) {
      const error = new Error();
      error.message = validation.error;
      return res.status(400).send(error);
    }

    next();
  }

  async _register(req, res, next) {
    const { email, password, subscription } = req.body;
    const isUserExist = await userModel.findOne({ email });

    if (isUserExist) {
      const error = new Error();
      error.message = 'Email in use';
      return res.status(409).send(error);
    }

    const hashedPassword = await bcrypt.hash(password, this._costFactor);

    const userInBase = await userModel.create({
      email,
      subscription,
      password: hashedPassword,
    });

    const user = {
      email: userInBase.email,
      subscription: userInBase.subscription,
    };

    res.status(201).send({ user });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const userInBase = await userModel.findOne({ email });
    if (!userInBase) {
      const error = new Error();
      error.message = 'Email or password is wrong';
      return res.status(401).send(error);
    }

    const isPasswordValid = await bcrypt.compare(password, userInBase.password);

    if (!isPasswordValid) {
      const error = new Error();
      error.message = 'Email or password is wrong';
      return res.status(401).send(error);
    }
    const token = await jwt.sign(
      { _id: userInBase._id },
      process.env.JWT_SECRET_KEY,
    );
    await userModel.updateToken(userInBase._id, token);
    const user = {
      email: userInBase.email,
      subscription: userInBase.subscription,
    };

    return res.status(200).json({ token, user });
  }

  async logout(req, res, next) {
    try {
      const userInBase = req.user;
      await userModel.updateToken(userInBase._id, null);
      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async getCurrent(req, res, next) {
    const [user] = [req.user];
    return res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  }

  async authorizationCheck(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization') || '';
      const token = authorizationHeader.split(' ')[1];

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET_KEY)._id;
      } catch (e) {
        const error = new Error();
        error.message = 'Not authorized';
        return res.status(401).send(error);
      }

      const userInBase = await userModel.findById(userId);
      if (!userInBase || userInBase.token !== token) {
        const error = new Error();
        error.message = 'Not authorized';
        return res.status(401).send(error);
      }

      req.user = userInBase;

      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UsersController();
