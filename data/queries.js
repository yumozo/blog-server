// const { response, request } = require('../app')
import pg from 'pg'
const Pool = pg.Pool
import dotenv from 'dotenv'
dotenv.config()

// const connectionString = `postgresql://`
// const connectionString = `postgres://`

// const pool = new Pool({
//   user: 'me',
//   host: 'localhost',
//   database: 'api',
//   password: 'password',
//   port: 5432
// })
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT
})

const getUsers = (req, res) => {
  pool.query('select * from user_account order by id asc', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getUserById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('select * from user_account where id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createUser = (req, res) => {
  const { name, email } = req.body

  pool.query('insert into user_account (name, email) values ($1, $2) returning *',
    [name, email], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`Users added with ID: ${results.rows[0].id}`)
    })
}

const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body

  pool.query(
    'update user_account set name = $1, email = $2 where id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`Users modified with ID: ${id}`)
    }
  )
}

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('delete from user_account where id = $1',
    [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User deleted with ID: ${id}`)
    })
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}