import pool from './db.js'

const getPosts = (req, res) => {
  const filter = req.query.filter
  let q
  if (Object.keys(req.query).length === 0 && filter.length <= 3) {
    // without fitler - return all users
    q = 'select * from post order by id asc'
    pool.query(q, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  } else {
    // with filter
    q = 'select * from post where lower(content) like $1'
    pool.query(q, ['%' + filter + '%'], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
}

const getPostById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('select * from post where id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createPost = (req, res) => {
  const { name, email } = req.body

  pool.query('insert into post (name, email) values ($1, $2) returning *',
    [name, email], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`Users added with ID: ${results.rows[0].id}`)
    })
}

// const updatePost = (req, res) => {
//   const id = parseInt(req.params.id)
//   const { name, email } = req.body

//   pool.query(
//     'update post set name = $1, email = $2 where id = $3',
//     [name, email, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       res.status(200).send(`Users modified with ID: ${id}`)
//     }
//   )
// }

const deletePost = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('delete from post where id = $1',
    [id], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`User deleted with ID: ${id}`)
    })
}

export default {
  getPosts,
  getPostById,
  createPost,
  // updatePost,
  deletePost
}