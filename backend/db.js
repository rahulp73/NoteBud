import { configDotenv } from 'dotenv';
configDotenv()
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, // Default PostgreSQL port
    // ssl: {
    //     rejectUnauthorized: false,
    // }
})

export default pool