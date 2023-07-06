const express = require('express');
const route = express.Router();
const {addContact, getContacts, getContactsById, updateContact, deletecontacts} =  require('../controller/controller')


route.post('/addContact',addContact)

route.get('/getContacts',getContacts)

route.get('/getContactsById/:id',getContactsById)

route.put('/updateContact/:id',updateContact);

route.delete('/deleteContacts/:id',deletecontacts);


module.exports = route;