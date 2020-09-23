const contacts = require('../contacts');
const Joi = require('joi');

class ContactsController {
  async getContacts(req, res) {
    const list = await contacts.listContacts();
    res.status(200).send(list);
  }

  async getContactById(req, res) {
    const contactById = await contacts.getContactById(
      parseInt(req.params.contactId),
    );
    if (contactById) {
      res.status(200).send(contactById);
    } else {
      res.status(404).send({ message: 'Not found' });
    }
  }

  async createContact(req, res) {
    const { name, email, phone } = await req.body;
    const newContacts = await contacts.addContact(name, email, phone);
    res.status(201).send(newContacts);
  }

  async deleteContact(req, res) {
    const contactsAfterRemove = await contacts.removeContact(
      parseInt(req.params.contactId),
    );
    if (contactsAfterRemove) {
      const message = {
        message: 'contact deleted',
      };
      res.status(200).send(message);
    } else {
      const error = new Error();
      error.message = 'Not found';
      res.status(404).send(error);
    }
  }

  async updateContact(req, res) {
    const contactsAfterUpdate = await contacts.updateContact(
      parseInt(req.params.contactId),
      req.body,
    );
    res.status(200).send(contactsAfterUpdate);
  }

  async validateCreateContact(req, res, next) {
    const error = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().min(5).required(),
      phone: Joi.string().min(5).required(),
    }).validate(req.body);
    if (error.error) {
      error.error.message = 'missing required name field';
      return res.status(400).send(error.error);
    }
    next();
  }

  async validateUpdateContact(req, res, next) {
    const err = new Error();
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
      err.message = 'missing fields';
      return res.status(400).send(err);
    }

    const Schema = Joi.object({
      name: Joi.string().min(3),
      email: Joi.string().min(5),
      phone: Joi.string().min(3),
    });

    const validation = Schema.validate(req.body);

    if (validation.error) {
      validation.error.message = 'fields incorrect';
      return res.status(400).send(validation.error);
    }

    next();
  }
}

module.exports = new ContactsController();
