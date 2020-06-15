const express = require('express');
const FavoritesService = require('./favorites-service');
const FavoritesRouter = express.Router();
const jsonBodyParser = express.json();
const xss = require("xss");
const { requireAuth } = require('../middleware/basic-auth');

const serializeFavorite = (favorite) => ({
    id: favorite.id,
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
            res.json(favorites.map(serializeFavorite))
          })
          .catch(next)
      })
     .all(requireAuth)
     .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { place_id, name, rating, address, user_id } = req.body
        const newFavorite = { place_id, name, rating, address, user_id }

        for (const [key, value] of Object.entries(newFavorite)) {
        if (value == null) {
            return res.status(400).json({
            error: `Missing '${key}' in request body`
            })
        }
        }

    FavoritesService.insertFavorite(req.app.get('db'), newFavorite)
        .then((favorite) =>{
            res 
                .status(201)
                .json(serializeFavorite(newFavorite))
                .end()
        })
        .catch(next);
    })

    FavoritesRouter
        .route('/:place_id')
        .delete((req, res, next) => {
               res.status(204).end()
               FavoritesService.deleteFavorite(
                 req.app.get('db'),
                 req.params.place_id
               )
                 .then(() => {
                   res.status(204).end()
                 })
                 .catch(next)
              })

  module.exports = FavoritesRouter