const Joi = require('joi');
const contactModel = require('./contactsModel');
const {
  Types: { ObjectId },
} = require('mongoose');

class ContactsController {
  async getContacts(req, res, next) {
    try {
      const list = await contactModel.find();
      return res.status(200).send(list);
    } catch (e) {
      next(e);
    }
  }

  async getContactById(req, res, next) {
    try {
      const contactId = req.params.contactId;

      const contact = await contactModel.findById(contactId);

      if (!contact) {
        return res.status(404).send({ message: 'Not found' });
      }
      return res.status(200).send(contact);
    } catch (e) {
      next(e);
    }
  }

  async createContact(req, res, next) {
    try {
      const newContacts = await contactModel.create(req.body);
      return res.status(201).json(newContacts);
    } catch (e) {
      next(e);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const contactId = req.params.contactId;

      const deletedContact = await contactModel.findByIdAndDelete(contactId);

      if (!deletedContact) {
        const error = new Error();
        error.message = 'Not found';
        return res.status(404).send(error);
      }

      return res.status(200).send('Success');
    } catch (e) {
      next(e);
    }
  }

  async updateContact(req, res, next) {
    const { contactId } = req.params;
    const contactToUpdate = await contactModel.findContactByIdAndUpdate(
      contactId,
      req.body,
    );

    if (!contactToUpdate) {
      return res.status(404).send();
    }

    return res.status(200).send();
  }

  validateId(req, res, next) {
    const { contactId } = req.params;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).send('validateId is stop the code');
    }
    next();
  }

  async validateCreateContact(req, res, next) {
    const contactRules = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().min(5).required(),
      phone: Joi.string().min(5).required(),
    }).validate(req.body);
    if (contactRules.error) {
      contactRules.error.message = 'missing required name field';
      return res.status(400).send(contactRules.error);
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
