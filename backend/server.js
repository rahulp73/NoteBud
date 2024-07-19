import { configDotenv } from 'dotenv';
configDotenv()
// Import required modules
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import pool from './db.js';
import router from './router/routes.js';

const app = express();
const port = process.env.PORT || 8080;

// Middleware to parse JSON bodies
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())
app.use(express.static('./assets'))
app.use(cors({
    origin:'http://localhost:5173',
    optionsSuccessStatus: 204,
    credentials : true
}))

app.use("", router)

const startServer = async () => {
    try {
      // Test database connection asynchronously
      await pool.connect();
      console.log('Connected to PostgreSQL database successfully!');
  
      // Start the server after successful connection
      app.listen(port, () => {
        console.log(`Listening at PORT ${port}`);
      });
    } catch (error) {
      console.error('Error:', error); // Log both database connection and server errors
      process.exit(1); // Exit with error code
    }
  };

startServer()