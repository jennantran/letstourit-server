const AuthService = require('../src/auth/auth-service');
const knex = require('knex')
const mocha = require('mocha');
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');

describe('Auth Endpoints', function() {
    let db;
    let testUser = [
        {
            id: 1,
            username: 'VietH',
            password: 'password1',
        },
        {  
            id: 2,
            username: 'PeggyWu',
            password: 'password2'
        }
    ]
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      });
      app.set('db', db);
    });
  
    after('disconnect from db', () => db.destroy());
    before('clean the tables before ', () => db.raw('TRUNCATE TABLE tour_users RESTART IDENTITY CASCADE'));
    afterEach('clean the tables afterEach', () =>  db.raw('TRUNCATE TABLE tour_users RESTART IDENTITY CASCADE')); 
  

    context(`Given 'tour_users' has data`, () => {
        before(() => {
            return db
                .into('tour_users')
                .insert(testUser)
            })
    
        it(`get user`, () => {
        return AuthService.getUserWithUserName(db,'VietH')
        .then(actual => {
        expect(actual).to.eql({
            id: 1,
            username: 'VietH',
            password: 'password1',
              })
            })
        })     
    })    
})