const express = require('express');
const router = express.Router();
const contastsController = require('./contactsController');

router.get('/', contastsController.getContacts);

router.get('/:contactId', contastsController.getContactById);

router.post(
  '/',
  contastsController.validateCreateContact,
  contastsController.createContact,
);

router.delete('/:contactId', contastsController.deleteContact);

router.patch(
  '/:contactId',
  contastsController.validateUpdateContact,
  contastsController.updateContact,
);

module.exports = router;
