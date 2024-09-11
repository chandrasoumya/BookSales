const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authenticateToken = require("../middleware/auth");
const Router = express.Router();

// User Registration
Router.post("/register", async (req, res) => {
  try {
    const { FName, LName, Mobile, Email, Password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      FName,
      LName,
      Mobile,
      Email,
      Password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send("New user is added");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

// User Login
Router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: user.Email, id: user._id },
      process.env.JWT_CODE,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .send({
        FName: user.FName,
        LName: user.LName,
        Email: user.Email,
        Mobile: user.Mobile,
        token,
      });
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

// Get User by Email (Secured)
Router.get("/users/:email", authenticateToken, (req, res) => {
  User.findOne({ Email: req.params.email })
    .then((data) => {
      if (!data) {
        return res.status(404).send("User not found");
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send("Error: " + err);
    });
});

// Delete User by Email (Secured)
Router.delete("/users/:email", authenticateToken, (req, res) => {
  User.findOneAndDelete({ Email: req.params.email })
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User deleted successfully");
    })
    .catch((err) => {
      res.status(400).send("Error: " + err);
    });
});

// Update User by Email (Secured)
Router.put("/users/:email", authenticateToken, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If the password is being updated, hash it before saving
    if (updateData.Password) {
      updateData.Password = await bcrypt.hash(updateData.Password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { Email: req.params.email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

module.exports = Router;
