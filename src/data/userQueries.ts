import { RequestHandler } from 'express'
import pool from './db.js'

const getUsers: RequestHandler = (req, res) => {
  let q
  if (Object.keys(req.query).length === 0) {
    // without fitler - return all users
    q = 'select * from user_account order by user_id asc'
    pool.query(q, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  } else {
    // with filter
    q = 'select * from user_account where lower(name) like $1'
    pool.query(q, ['%' + req.query.filter + '%'], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
}

const getUserById: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('select * from user_account where user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getUserByName: RequestHandler = (req, res) => {
  const pattern = req.params.name
  pool.query('select * from getuserbyname($1)',
    // ["lower(" + req.params.name + ")"],
    [pattern],
    (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createUser: RequestHandler = (req, res) => {
  const { name, email, password } = req.body
  const q = `
    insert into user_account (name, email, password_hash)
    values ($1, $2, $3) returning *`

  pool.query(q, [name, email, password], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`Users added with ID: ${results.rows[0].id}`)
    })
}

const updateUser: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, email } = req.body

  pool.query(
    'update user_account set name = $1, email = $2 where user_id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`Users modified with ID: ${id}`)
    }
  )
}

const deleteUser: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('delete from user_account where user_id = $1',
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
  getUserByName,
  createUser,
  updateUser,
  deleteUser
}