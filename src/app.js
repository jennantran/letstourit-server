require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const errorHandler = require('./error-handler')
const FavoritesRouter = require('./favorites/favorites-router');
const authRouter = require('./auth/auth-router')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(cors())
app.use(helmet())

app.use(cors());
 
app.use('/api/favorites', FavoritesRouter)

app.get('/api', (req, res) => {
    res.send('Hello, world!')
 })

app.use('/api/auth', authRouter)
   
app.use(errorHandler)

module.exports = app