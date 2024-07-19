import { compare, hash } from "bcrypt"
import pool from "../db.js"
import JWT from "jsonwebtoken";
import { welcomeMail } from "../utils/mailConfig.js";

const options = {
  maxAge: 1000 * 60 * 60 * 24, // expire after 7 days
  httpOnly: false, // Cookie will not be exposed to client side code
  sameSite: "lax", // If client and server origins are different
  secure: false, // use with HTTPS only,
  priority: 'Medium'
};

export const signup = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    res.status(400).json({ message: 'Please Add All Fields' });
    return;
  }
  try {
    const existingUser = await pool.query('SELECT * FROM User_Table WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      res.status(400).json({ message: 'User Already Exists With That Email' });
      return;
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO User_Table (email, name, password) VALUES ($1, $2, $3) RETURNING *',
      [email, name, hashedPassword]
    );
    const token = JWT.sign({ _id: newUser.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
    welcomeMail(newUser.rows[0].email, newUser.rows[0].name)
    res.status(201).cookie("token", token, options).json({
      email: newUser.rows[0].email,
      name: newUser.rows[0].name,
      avatar : newUser.rows[0].avatar?.toString('base64')
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json(JSON.stringify({ message: 'Please Add All Fields' }))
    return
  }
  try {
    const user = await pool.query('SELECT * FROM User_Table WHERE email = $1', [email])
    if (user.rows.length === 0) {
      res.status(400).json({ message: 'User Dooes Not Exist' })
      return;
    }
    const isMatch = await compare(password, user.rows[0].password)
    if (!isMatch) {
      res.status(400).json({ message: 'Password Did Not Match' });
      return;
    }
    const token = JWT.sign({ _id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
    res.status(200).cookie("token", token, options).json({ name: user.rows[0].name, email: user.rows[0].email, avatar: user.rows[0].avatar?.toString('base64') });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
}

export const newToken = async (req, res) => {
  const userId = req._id;
  try {
    const user = await pool.query('SELECT * FROM user_table WHERE user_id = $1', [userId])
    const token = JWT.sign({ _id: user.rows[0].user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
    res.status(200).cookie("token", token, options).json({ name: user.rows[0].name, email: user.rows[0].email, avatar: user.rows[0].avatar?.toString('base64') });
  } catch (error) {

  }
}

export const saveName = async (req, res) => {
  const { name } = req.body;
  const userId = req._id; // Assuming user ID is available in req.user

  try {
    const result = await pool.query(
      'UPDATE user_table SET name = $1 WHERE user_id = $2 RETURNING *',
      [name, userId]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Name updated successfully', name: result.rows[0].name, email: result.rows[0].email, avatar: result.rows[0].avatar.toString('base64') });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveEmail = async (req, res) => {
  const { email } = req.body;
  const userId = req._id; // Assuming user ID is available in req.user

  try {
    const result = await pool.query(
      'UPDATE user_table SET email = $1 WHERE user_id = $2 RETURNING *',
      [email, userId]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Email updated successfully', name: result.rows[0].name, email: result.rows[0].email, avatar: result.rows[0].avatar.toString('base64') });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const setAvatar = async (req, res) => {
  try {
      const { avatarPreview } = req.body;
      const userId = req._id;

      // Convert the base64 string to a Buffer
      const avatarBuffer = Buffer.from(avatarPreview, 'base64');

      const query = 'UPDATE user_table SET avatar = $1 WHERE user_id = $2 RETURNING *';
      const result = await pool.query(query, [avatarBuffer, userId]);

      if (result.rows.length > 0) {
          res.status(200).json({ name: result.rows[0].name, email: result.rows[0].email ,avatar: result.rows[0].avatar.toString('base64') });
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error('Error updating avatar:', error);
      res.status(500).send('Internal server error');
  }
}