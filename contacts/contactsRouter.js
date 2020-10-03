const express = require('express');
const contactsController = require('./contactsController');
const router = express.Router();
const contastsController = require('./contactsController');

router.get('/', contastsController.getContacts);

router.get(
  '/:contactId',
  contactsController.validateId,
  contastsController.getContactById,
);

router.post(
  '/',
  contastsController.validateCreateContact,
  contastsController.createContact,
);

router.delete(
  '/:contactId',
  contactsController.validateId,
  contastsController.deleteContact,
);

router.patch(
  '/:contactId',
  contactsController.validateId,
  contastsController.validateUpdateContact,
  contastsController.updateContact,
);

module.exports = router;
