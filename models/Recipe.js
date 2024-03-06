const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  instructions: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to the User model
  images: [String], // URLs to images
  // Add other fields as necessary
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
