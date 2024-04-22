const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Favorites = require('../models/favourite');
const authenticate = require('../authenticate');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

// Create, Read, Delete - recipe
favoriteRouter.route('/')
    .get(authenticate.verifyOrdinaryUser, (req, res, next) => {
        const userId = req.user._id;
        Favorites.findOne({ user: userId })
            .populate('recipes')
            .populate('user')
            .then((favorites) => {
                if (!favorites) {
                    const err = new Error('Favorites not found');
                    err.status = 404;
                    throw err;
                }
                res.json(favorites);
            })
            .catch((err) => {
                next(err);
            });
    })
    .post(authenticate.verifyOrdinaryUser, (req, res, next) => {
        const userId = req.user._id;
        const recipeIds = req.body; // Correctly access the recipeIds array from the request body
    
        if (!Array.isArray(recipeIds)) {
            const err = new Error('Invalid recipeIds format');
            err.status = 400; // Bad Request
            return next(err);
        }
    
        Favorites.findOne({ user: userId })
            .then((favorites) => {
                if (!favorites) {
                    favorites = new Favorites({ user: userId, recipes: [] });
                }
                // Use a for loop to add recipe IDs
                for (let i = 0; i < recipeIds.length; i++) {
                    const recipeId = recipeIds[i];
                    if (!favorites.recipes.includes(recipeId)) {
                        favorites.recipes.push(recipeId);
                    }
                }
                return favorites.save();
            })
            .then((savedFavorites) => {
                res.json(savedFavorites);
            })
            .catch((err) => {
                next(err);
            });
    })      
    .delete(authenticate.verifyOrdinaryUser, (req, res, next) => {
        const userId = req.user._id;
        Favorites.findOneAndRemove({ user: userId })
            .then(() => {
                res.status(204).send('Favorites deleted');
            })
            .catch((err) => {
                next(err);
            });
    });

// Create, Read, Delete - recipe-by ID
favoriteRouter.route('/:recipeId')
    .post(authenticate.verifyOrdinaryUser, (req, res, next) => {
        const userId = req.user._id;
        const recipeId = req.params.recipeId;

        Favorites.findOne({ user: userId })
            .then((favorites) => {
                if (!favorites) {
                    favorites = new Favorites({ user: userId, recipes: [recipeId] });
                } else if (!favorites.recipes.includes(recipeId)) {
                    favorites.recipes.push(recipeId);
                }
                return favorites.save();
            })
            .then((savedFavorites) => {
                res.json(savedFavorites);
            })
            .catch((err) => {
                next(err);
            });
    })
    .put(authenticate.verifyAdmin, (req, res, next) => {
        // Add your logic for updating recipes here
    })
    .delete(authenticate.verifyOrdinaryUser, (req, res, next) => {
        const userId = req.user._id;
        const recipeId = req.params.recipeId;

        Favorites.findOne({ user: userId })
            .then((favorites) => {
                if (favorites) {
                    const index = favorites.recipes.indexOf(recipeId);
                    if (index !== -1) {
                        favorites.recipes.splice(index, 1);
                    }
                    return favorites.save();
                } else {
                    const err = new Error('Favorites not found');
                    err.status = 404;
                    throw err;
                }
            })
            .then((savedFavorites) => {
                res.json(savedFavorites);
            })
            .catch((err) => {
                next(err);
            });
    });

module.exports = favoriteRouter;
