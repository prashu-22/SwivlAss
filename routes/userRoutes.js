const express = require('express');
const User = require('../models/User');
const router = new express.Router();

// User registration
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken(); // Implement this method in your User model
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// User login
router.post('/login', async (req, res) => {
    try {
      const user = await User.findByCredentials(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.send({ user, token });
    } catch (error) {
      res.status(400).send(error.toString());
    }
  });
  

module.exports = router;
