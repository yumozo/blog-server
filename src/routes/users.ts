import express from 'express'
const router = express.Router()

import db from '../data/userQueries.js'

// get all
// find by queried name
router.get('/', db.getUsers);
// get by id
router.get('/:id', db.getUserById);
// get by name
router.get('/byName/:name', db.getUserByName);
// create a user
router.post('/', db.createUser);
// update
router.put('/:id', db.updateUser);
// delete
router.delete('/:id', db.deleteUser);

export default router