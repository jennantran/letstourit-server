const xss = require('xss')

const FavoritesService = {
    getAllFavorites(knex){
        return knex
            .select('*')
            .from('save_tour_favorites');
    },
    insertFavorite(knex, newFavorite){
        return knex
            .insert({
                place_id: `${newFavorite.id}`,
                name: `${newFavorite.name}`,
                rating: `${newFavorite.rating}`, 
                address: `${newFavorite.address}`, 
                user_id: `${newFavorite.user_id}`
            })
            .into('save_tour_favorites')
            .returning('*')
            .then(rows => {
                return rows[0]
        })
    },
    getAllFavoritesByUserId(knex, user_id){
        return knex
            .select('*')
            .from('save_tour_favorites')
            .where({'user_id': user_id});
    },
      deleteFavorite(knex , id){
        return knex('save_tour_favorites')
            .where({ id })
            .delete()
    },
}
module.exports = FavoritesService
