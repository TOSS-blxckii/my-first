// backend/routes/createUsersRoute.js
import express from "express";
import db from "../database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createUsersRoute = express.Router();

// Secret key for JWT
const JWT_SECRET = "your-secret-key"; // Change to a stronger secret

// Get all users (for testing)
createUsersRoute.get("/users", (req, res) => {
  const qGetUsers = "SELECT * FROM users";
  db.query(qGetUsers, (error, data) => {
    if (error) return res.status(500).json(error);
    return res.status(200).json(data);
  });
});

// Register a new user
createUsersRoute.post("/user/register", async (req, res) => {
  const { username, lastname, email, password, phone, address } = req.body;

  if (!username || !lastname || !email || !password || !phone || !address) {
    return res.status(400).json("All fields are required");
  }

  try {
    // Check if the user already exists
    const qCheckUser = "SELECT * FROM users WHERE email = ?";
    db.query(qCheckUser, [email], async (error, data) => {
      if (error) return res.status(500).json(error);
      if (data.length > 0) {
        return res.status(409).json("User already exists");
      }

      // Hash password
      const hashPassword = await bcrypt.hash(password, 10);
      
      // Insert new user
      const qRegister = `
        INSERT INTO users (username, lastname, email, password, phone, address) 
        VALUES (?)
      `;
      const values = [username, lastname, email, hashPassword, phone, address];

      db.query(qRegister, [values], (error, data) => {
        if (error) return res.status(500).json(error);
        console.log(data)
        // Create JWT Token
        const token = jwt.sign(
          { user_id: data.insertId, email,lastname },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        return res.status(201).json({
          message: "User registered successfully",
          data: { user_id: data.insertId, username, email,lastname },
          token, // Send token to frontend
        });

      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal server error");
  }
});

export default createUsersRoute;
