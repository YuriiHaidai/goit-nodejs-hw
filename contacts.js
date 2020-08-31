const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

function listContacts() {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    console.table(parsedData);
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    const findContactsById = parsedData.find(
      contact => contact.id === contactId,
    );

    console.log(`Contact with id:${contactId} is: `, findContactsById);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    const contactsAfterRemove = parsedData.filter(
      contact => contact.id !== contactId,
    );
    fs.writeFile(contactsPath, JSON.stringify(contactsAfterRemove), err => {
      if (err) throw err;
      console.log(`Contact with id:${contactId} was removed`);
      listContacts();
    });
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, (err, data) => {
    if (err) throw err;
    const parsedData = JSON.parse(data);
    parsedData.push({ id: uuidv4(), name: name, email: email, phone: phone });
    fs.writeFile(contactsPath, JSON.stringify(parsedData), err => {
      if (err) throw err;
      console.log(
        `Contact added: Name:${name}, Email:${email}, Phone:${phone}`,
      );
      listContacts();
    });
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
