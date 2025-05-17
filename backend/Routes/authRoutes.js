const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const { inMemoryDB, isConnected } = require("../connection");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Use MongoDB if connected, otherwise use in-memory DB
    if (isConnected()) {
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({ message: "Username already exists" });
        }
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      // Generate token for the new user
      const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET || 'buysmart-development-secret', { expiresIn: "1h" });

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: { id: newUser._id, username: newUser.username, email: newUser.email }
      });
    } else {
      // In-memory fallback
      // Check for existing username
      const existingUsername = inMemoryDB.findUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check for existing email
      const existingEmail = inMemoryDB.findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = inMemoryDB.addUser({ username, email, password: hashedPassword });

      // Generate token for the new user
      const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET || 'buysmart-development-secret', { expiresIn: "1h" });

      console.log(`Registered new user in memory: ${username}, ${email}`);
      
      res.status(201).json({
        message: "User registered successfully",
        token,
        user: { id: newUser._id, username: newUser.username, email: newUser.email }
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  
  // User should provide either username or email
  if (!username && !email) {
    return res.status(400).json({ message: "Please provide either username or email" });
  }

  try {
    let user;
    // Use MongoDB if connected, otherwise use in-memory DB
    if (isConnected()) {
      // Query by either username or email
      if (username) {
        user = await User.findOne({ username });
      } else {
        user = await User.findOne({ email });
      }
    } else {
      // In-memory fallback
      if (username) {
        user = inMemoryDB.findUserByUsername(username);
      } else {
        user = inMemoryDB.findUserByEmail(email);
      }
    }

    if (!user) {
      console.log(`Login failed: ${username || email} not found`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Invalid password for ${username || email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'buysmart-development-secret', { expiresIn: "1h" });

    console.log(`Login successful: ${user.username}, ${user.email}`);
    
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
