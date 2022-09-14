import express from 'express'
const router = express.Router()

import db from '../data/userQueries.js'

router.get('/', db.getUsers);
router.get('/:id', db.getUserById);
router.post('/', db.createUser);
router.put('/:id', db.updateUser);
router.delete('/:id', db.deleteUser);

export default router