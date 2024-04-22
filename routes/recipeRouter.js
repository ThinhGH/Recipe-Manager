const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Recipes = require('../models/recipe'); // Import the quiz model
const recipes = require('../models/recipe');

const recipeRouter = express.Router();
recipeRouter.use(bodyParser.json());

recipeRouter.route('/')
.get((req, res, next) => {
    
    Recipes.find({})
        .populate('Author') // Thêm điều kiện tại đây
        .then((recipe) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(recipe);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, (req, res, next) => {
        const authorId = req.decoded._id;
        req.body.Author = authorId;
        Recipes.create(req.body)
            .then((news) => {
                console.log('News Created: ', news);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(news);
            })
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(authenticate.verifyOrdinaryUser, (req, res, next) => {
        Recipes.deleteMany()
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
    recipeRouter.route('/status')
    .get((req, res, next) => {
        Recipes.find({ status: true })
            .then((Recipes) => {
                res.status(200).json(Recipes);
            })
            .catch((err) => next(err));
    });
    recipeRouter.route('/:RecipesId')
    .get((req, res, next) => {
        Recipes.findById(req.params.RecipesId)
            .then((recipe) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(recipe);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser, (req, res, next) => {
        res.end("POST operation not supported on /quizzes/" + req.params.RecipesId);
    })
    .put(authenticate.verifyOrdinaryUser, (req, res, next) => {
        const authorId = req.decoded._id;
        Recipes.findByIdAndUpdate(req.params.RecipesId, {$set: req.body}, {new: true})
            .then((recipe) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(recipe);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser,(req, res, next) => {
        Recipes.findByIdAndRemove(req.params.RecipesId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = recipeRouter;
