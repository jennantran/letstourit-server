const FavoritesService = require('../src/favorites/favorites-service');
const knex = require('knex');

  describe(`Favorites service object`, function() {
       let db
          let testUsers = [
         {
              id: 1,
              username: 'jennantran8',
              password:'$2a$12$5IzM0iAWkSzN.tuzA7gOfuAaUshNP6M2Qa8yZitgeBEItE0IS1J3m',
             },
           ]
         let testFavorites =[
             {
                place_id:'ChIJD9j4j9R_j4AR4Ux0kcDrJq4',
                name:'Academy of Art University',
                rating: '3.9',
                address:'79 New Montgomery St, San Francisco, CA 94105, USA',
                user_id: 1,
             },
         ]
       before(() => {
         db = knex({
           client: 'pg',
           connection: process.env.TEST_DB_URL,
         })
       })
       
       before('clean the tables before ', () => db.raw('TRUNCATE TABLE tour_users, save_tour_favorites RESTART IDENTITY CASCADE'));

        before(() => {
            return db
                .into('tour_users')
                .insert(testUsers)
            })
        before(() => {
            return db
                .into('save_tour_favorites')
                .insert(testFavorites)
            })
        after(() => db.destroy())

describe(`getAllFavorites()`, () => {
     it(`resolves all favorites from 'save_tour_favorites' table`, () => {
       // test that FavoritesService.getFavorites gets data from table
        return FavoritesService.getAllFavorites(db)
         .then(actual => {
         expect(actual).to.eql(testFavorites)
      })
     })   
   })
   it(`it insert favorites into save_tour_favorites table`, () => {
    return FavoritesService.insertFavorite(knex, newFavorite)
        .then(actual => {
            expect(actual).to.eql([{
                place_id:'ChIJawCN2HyAhYARNagMvTWlbKw',
                name:'sweetgreen',
                rating: '4',
                address:'171 2nd St San Francisco, CA 94105',
                user_id: 1,
            }]);
        });
});

  })
