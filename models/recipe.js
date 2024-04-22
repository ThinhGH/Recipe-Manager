
const mongoose = require("mongoose");

  // Define the Cake Schema
  const RecipeSchema = new mongoose.Schema({
    Author: {type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,},
    title: String,
    Image: String,
    Ingredient: String,
    PrepareTime: String,
    CookingTime: String,
    Serving: String,
    Steps: String,
  });
  
  // Create Cakes and Topping models
  const Recipes = mongoose.model('Recipes', RecipeSchema);
  
  module.exports = Recipes;