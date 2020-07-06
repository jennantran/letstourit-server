const express = require('express');
const FavoritesService = require('./favorites-service');
const FavoritesRouter = express.Router();
const jsonBodyParser = express.json();
const xss = require("xss");
const { requireAuth } = require('../middleware/jwt-auth');

const serializeFavorite = (favorite) => ({
    id: favorite.place_id,
    name: xss(favorite.name), 
    rating: xss(favorite.rating), 
    address: xss(favorite.address),
    user_id: favorite.user_id,
});

FavoritesRouter
    .route('/')
    .get((req, res, next) => {
      FavoritesService.getAllFavoritesByUserId(req.app.get('db'), req.headers.user_id)
        .then(favorites => {
          res.json(favorites.map(serializeFavorite));
        })
        .catch(next);
    })
    .all(requireAuth);
 
FavoritesRouter
    .route('/:place_id')
        .delete((req, res, next) => {
            FavoritesService.deleteFavorite(
                req.app.get('db'),
                req.params.place_id,
            )
                .then(numRowsAffected => {
                res.status(204).end();
                })
                .catch(next);
            })
    
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { id, name, rating, address, user_id } = req.body.faveObject;
        const newFavorite = { id, name, rating, address, user_id };
            for (const [key, value] of Object.entries(newFavorite)) {
            if (value == null) {
                return res.status(400).json({
                error: `Missing '${key}' in request body`
                });
            }
            };
        FavoritesService.insertFavorite(req.app.get('db'), newFavorite).then(() => {
            res.status(201)
            .json(serializeFavorite(newFavorite));
            })
            .catch(next);
    });

module.exports = FavoritesRouter