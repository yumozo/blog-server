import express from 'express'
const router = express.Router();

/* GET db. */
router.get('/', function (req, res, next) {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});

export default router;
