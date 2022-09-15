import pg from 'pg'
const Pool = pg.Pool
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(<string>process.env.POSTGRES_PORT, 10)
})

export default pool