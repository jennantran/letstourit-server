const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const { hash } = require('bcryptjs')

const usersRouter = express.Router()
const jsonParser = express.json()


usersRouter
  .post('/', jsonParser, (req, res, next) => {
    const { password, username } = req.body
 
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username.value,
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password.value)
          .then(hashedPassword => {
            const newUser = {
              username: username.value,
              password: hashedPassword,
            }
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })
module.exports = usersRouter