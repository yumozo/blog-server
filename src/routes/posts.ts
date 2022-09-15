import express from 'express'
const router = express.Router()

import db from '../data/postQueries.js'

router.get('/', db.getPosts);
router.get('/:id', db.getPostById);
router.post('/', db.createPost);
// router.put('/:id', db.updatePost);
router.delete('/:id', db.deletePost);

export default router