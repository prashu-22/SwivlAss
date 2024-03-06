const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields as needed
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

// Method to check password validity
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7 days' });

  // Optionally save the token in the user model if you keep track of it
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
