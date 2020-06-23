require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./error-handler')
const FavoritesRouter = require('./favorites/favorites-router');
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router');

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())

app.use(cors());

// app.use(function validateBearerToken(req, res, next) {
//     const apiToken = process.env.API_TOKEN
//     const authToken = req.get('Authorization')
  
//     if (!authToken || authToken.split(' ')[1] !== apiToken) {
//       return res.status(401).json({ error: 'Unauthorized request' })
//     }
//     // move to the next middleware
//     next()
//   })

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  
app.use('/api/favorites', FavoritesRouter)


app.get('/api', (req, res) => {
    res.send('Hello, world!')
 })

app.use('/api/auth', authRouter)

app.use('/api/signUp', usersRouter)
   
app.use(errorHandler)

module.exports = app