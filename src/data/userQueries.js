import pool from './db.js'

const getUsers = (req, res) => {
  const filter = req.query.filter
  let q
  if (Object.keys(req.query).length === 0) {
    // without fitler - return all users
    q = 'select * from user_account order by id asc'
    pool.query(q, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  } else {
    // with filter
    q = 'select * from user_account where lower(name) like $1'
    pool.query(q, ['%' + filter + '%'], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
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