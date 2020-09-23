const express = require('express');
const contacts = require('./contacts');
const morgan = require('morgan');
const cors = require('cors');
// const argv = require('yargs').argv;

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.get('/api/contacts', async (req, res) => {
  const list = await contacts.listContacts();
  res.status(200).send(list);
});

app.get('/api/contacts/:contactId', async (req, res) => {
  const contactById = await contacts.getContactById(
    parseInt(req.params.contactId),
  );
  if (contactById) {
    res.status(200).send(contactById);
  } else {
    res.status(404).send({ message: 'Not found' });
  }
});

// Получает body в формате {name, email, phone}
// Если в body нет каких-то обязательных полей, возарщает json с ключом {"message": "missing required name field"} и статусом 400
// Если с body все хорошо, добавляет уникальный идентификатор в обьект контакта
app.post('/api/contacts', async (req, res) => {
  const { name, email, phone } = await req.body;
  const newContacts = await contacts.addContact(name, email, phone);
  res.status(201).send(newContacts);
});

app.delete('/api/contacts/:contactId', async (req, res) => {
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
});

app.patch('/api/contacts/:contactId', async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    const error = new Error();
    error.message = 'Missing fields';
    return res.status(400).send(error);
  }

  const contactById = await contacts.getContactById(
    parseInt(req.params.contactId),
  );

  if (!contactById) {
    const error = new Error();
    error.message = 'Not found';
    res.status(404).send(error);
  }

  const contactsAfterUpdate = await contacts.updateContact(
    parseInt(req.params.contactId),
    req.body,
  );
  res.status(200).send(contactsAfterUpdate);
});

app.listen(3000, e => {
  e ? console.error(e) : console.log('Start listening at port 3000');
});

// function invokeAction({ action, id, name, email, phone }) {
//   switch (action) {
//     case 'list':
//       contacts.listContacts();
//       break;

//     case 'get':
//       contacts.getContactById(id);
//       break;

//     case 'add':
//       contacts.addContact(name, email, phone);
//       break;

//     case 'remove':
//       contacts.removeContact(id);
//       break;

//     default:
//       console.warn('\x1B[31m Unknown action type!');
//   }
// }

// invokeAction(argv);
