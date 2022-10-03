import { RequestHandler } from 'express'
import pool from './db.js'

const getPosts: RequestHandler = (req, res) => {
  const filter = req.query.filter
  let q
  if (filter) {
    // with filter
    q = 'select * from post where lower(content) like $1'
    pool.query(q, ['%' + filter + '%'], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  } else {
    // without fitler - return all users
    q = 'select * from post order by post_id asc'
    pool.query(q, (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
  }
}

const getPostById: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id)

  const q1 = 'select * from post where post_id = $1'
  const q2 =
    `select p.title, p.content, p.slug, p.creation_date, u.name, u.user_id from post p inner join user_account u on p.author_id = u.user_id where p.post_id = $1`
  pool.query(q2, [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createPost: RequestHandler = (req, res) => {
  const {
    author_id, // 1
    title, // 2
    slug, // 3
    summary, // 4
    creation_date, // 5
    content, // 6
    tag, // 7
  } = req.body
  let q = `
    insert into post (author_id, title, slug, summary, creation_date, content, tag)
      values ($1, $2, $3, $4, $5, $6) returning *
    insert into post_tag (post_id, tag_id)
      values ($8, $7)`
  let q1 = `select createpost($1, $2, $3, $4, $5, $6, $7)` 
  
  pool.query(q1,
    [
      author_id,
      title,
      slug,
      summary,
      creation_date,
      content,
      tag,
    ],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send(`Posts added with ID: ${results.rows[0].post_id}`)
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

const deletePost: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('delete from post where post_id = $1',
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