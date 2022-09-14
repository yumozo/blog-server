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