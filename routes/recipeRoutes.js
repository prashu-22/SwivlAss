const express = require('express');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const router = new express.Router();

// Create a recipe
router.post('/recipes', auth, async (req, res) => {
  const recipe = new Recipe({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await recipe.save();
    res.status(201).send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/recipes', auth, async (req, res) => {
    try {
      await req.user.populate('recipes').execPopulate();
      res.send(req.user.recipes);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Update a recipe
router.patch('/recipes/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'ingredients', 'instructions'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.user._id });
  
      if (!recipe) {
        return res.status(404).send();
      }
  
      updates.forEach((update) => recipe[update] = req.body[update]);
      await recipe.save();
      res.send(recipe);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

  // Delete a recipe
router.delete('/recipes/:id', auth, async (req, res) => {
    try {
      const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  
      if (!recipe) {
        res.status(404).send();
      }
  
      res.send(recipe);
    } catch (error) {
      res.status(500).send();
    }
  });
  

module.exports = router;
