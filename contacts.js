const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  const data = await fs.promises.readFile(contactsPath, 'utf-8');
  console.table(JSON.parse(data));
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const parsedData = await listContacts();
  const findContactsById = parsedData.find(contact => contact.id === contactId);
  console.log(`Contact with id:${contactId} is: `, findContactsById);
  return findContactsById;
}

async function removeContact(contactId) {
  const parsedData = await listContacts();
  const contactsAfterRemove = parsedData.filter(
    contact => contact.id !== contactId,
  );
  await fs.promises.writeFile(
    contactsPath,
    JSON.stringify(contactsAfterRemove),
  );
  console.log(`Contact with id:${contactId} was removed`);
  return await listContacts();
}

async function addContact(name, email, phone) {
  const parsedData = await listContacts();
  const contactsAfterAdd = [
    ...parsedData,
    { id: uuidv4(), name, email, phone },
  ];
  await fs.promises.writeFile(contactsPath, JSON.stringify(contactsAfterAdd));
  console.log(`Contact added: Name:${name}, Email:${email}, Phone:${phone}`);
  return await listContacts();
}

module.exports = { listContacts, getContactById, removeContact, addContact };
