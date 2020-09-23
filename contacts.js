const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.promises.readFile(contactsPath, 'utf-8');
    console.table(JSON.parse(data));
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
}

async function getContactById(contactId) {
  try {
    const parsedData = await listContacts();
    const findContactById = parsedData.find(
      contact => contact.id === contactId,
    );
    console.log(`Contact with id:${contactId} is: `, findContactById);
    return findContactById;
  } catch (e) {
    console.error(e);
  }
}

async function addContact(name, email, phone) {
  try {
    const parsedData = await listContacts();
    const newContact = { id: uuid(), name, email, phone };
    const contactsAfterAdd = [...parsedData, newContact];
    await fs.promises.writeFile(contactsPath, JSON.stringify(contactsAfterAdd));
    console.log(`Contact added: Name:${name}, Email:${email}, Phone:${phone}`);
    return newContact;
  } catch (e) {
    console.error(e);
  }
}

async function removeContact(contactId) {
  try {
    if (await getContactById(contactId)) {
      const parsedData = await listContacts();
      const contactsAfterRemove = parsedData.filter(
        contact => contact.id !== contactId,
      );
      await fs.promises.writeFile(
        contactsPath,
        JSON.stringify(contactsAfterRemove),
      );
      console.log(`Contact with id:${contactId} was removed`);
      return true;
    }
  } catch (e) {
    console.error(e);
  }
}

async function updateContact(contactId, updateData) {
  try {
    const contact = await getContactById(contactId);
    const parsedData = await listContacts();
    const contacts = parsedData.map(contact => {
      if (contact.id === contactId) {
        return { ...contact, ...updateData };
      }
      return contact;
    });
    await fs.promises.writeFile(contactsPath, JSON.stringify(contacts));
    return { ...contact, ...updateData };
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
