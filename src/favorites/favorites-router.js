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
      ArticlesService.getAllFavorites(req.app.get('db'))
        .then(favorites => {
          res.json(favorites.map(FavoritesService.serializeFavorites))
        })
        .catch(next)
    })
    .all(requireAuth)
  
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
        .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { id, name, rating, address, user_id } = req.body
        const newFavorite = { id, name, rating, address, user_id }
        console.log(newFavorite);
        for (const [key, value] of Object.entries(newFavorite)) {
        if (value == null) {
            return res.status(400).json({
            error: `Missing '${key}' in request body`
            })
        }
        }
        // .get((req, res, next) => {
        //     FavoritesService.getAllFavoritesByUserId(req.app.get('db'))
        //       .then(favorites => {
        //         res.json(favorites.map(FavoritesService.serializeFavorites))
        //       })
        //       .catch(next)
        //   })
        //   .all(requireAuth)
        
    FavoritesService.insertFavorite(req.app.get('db'), newFavorite)
        .then((favorite) =>{
            res 
                .status(201)
                .json(serializeFavorite(newFavorite))
                .end()
        })
        .catch(next);
    })
        

  module.exports = FavoritesRouter