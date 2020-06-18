const FavoritesService = require('../src/favorites/favorites-service');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const chai = require('chai');

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
            app.set('db',db)
        })
        before('clean the tables before ', () => db.raw('TRUNCATE TABLE tour_users, save_tour_favorites RESTART IDENTITY CASCADE'));
        afterEach('clean the tables afterEach', () =>  db.raw('TRUNCATE TABLE tour_users, save_tour_favorites RESTART IDENTITY CASCADE')); 
        after('disconnect from db',() => db.destroy()) 

    context(`Given 'tour_favorites' has data`, () => {
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
    
       it(`getAllFavorites() resolves all favorites from 'tour_favorites' table`, () => {
       // test that FavoritesService.getFavorites gets data from table
   
        return FavoritesService.getAllFavorites(db)
         .then(actual => {
         expect(actual).to.eql(testFavorites)
      })
     })   
     it(`deleteFavorites() remove a favorite by placeId`, () => {
        return FavoritesService.deleteFavorite(db, 'ChIJD9j4j9R_j4AR4Ux0kcDrJq4')  
   })
 
})
    context(`Given 'tour_favorites' has no data`, () => {
        beforeEach('get user ids', () => {
            return db
                .into('tour_users')
                .insert(testUsers)
                .returning('id')
                .then((res) => {
                    userId1 = res[0];
                });
        });

       it(`getAllFavorites() resolves an empty array`, () => {
         return FavoritesService.getAllFavorites(db)
           .then(actual => {
             expect(actual).to.eql([])
           })
       })
       it(`insertFavorite() inserts a new favorite and resolves the new favorite with an 'id'`, () => {
          const newFavorite = {
            place_id: 'ChIJawCN2HyAhYARNagMvTWlbKw',
            name: 'sweetgreen',
            rating: '4',
            address: '171 2nd St San Francisco, CA 94105',
            user_id: userId1,
          }
          return FavoritesService.insertFavorite(db, newFavorite)
       })
    })
  })
