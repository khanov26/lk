const casual = require('casual');
const fs = require('fs');
const path = require('path');

const generateContact = id => ({
    id,
    email: casual.email,
    firstname: casual.first_name,
    lastname: casual.last_name,
    city: casual.city,
    zip: casual.zip(5),
});

const CONTACTS_NUMBER = 100;

const contacts = [];
for (let i = 1; i <= CONTACTS_NUMBER; i++) {
    contacts.push(generateContact(i));
}

const dbFile = path.join(__dirname, 'db.json');
try {
    const db = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
    fs.writeFileSync(dbFile, JSON.stringify({...db, contacts}, undefined, 2));
} catch (err) {
    console.log(err);
}