import pool from '../pool'

// ---
let users

/* export default */ class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return
    }
    try {
      /* restaurants = await conn.db(process.env.RESTREVIEWS_NS)
        .collection("restaurants") */
      users = /* await */ getUsers() // do I need await here?
    } catch (error) {
      console.error(`Unable to establish a connection.
        Handle in UsersDAO: ${error}`
      );
    }
  }

  static async getUsers({
    filters = null,
    page = 0,
    usersPerPage = 10, // replace users with results...
    // (posts with users) later.
  } = {}) {
    let query
    if (filters) {
      if ('name' in filters) {
        query = { $text: { $search: filters['name'] } }
      } /* else if ('somethingElse' in filters) {

      } */
    }

    let cursor

    try {
      cursor = await users.find(query)
    } catch (error) {
      console.error(`Unable to issue find command, ${error}`);
      return { usersList: [], totalNumUsers: 0 }
    }
  }

  static async getUserById(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          }
        },
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  }
                }
              },
              {
                $sort: {
                  date: -1,
                }
              }
            ],
            as: "reviews"
          }
        },
        {
          $addFields: {
            reviews: "$reviews"
          }
        }
      ]
      return await users.aggregate(pipeline).next()
    } catch (error) {
      console.error(`Something went wrong in getUserById: ${error}`);
      throw error
    }
  }
  // static async getSomethingElse() {}
}

// ---

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