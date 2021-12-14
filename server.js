if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

  const express = require('express')
  const app = express()  
  const bcrypt=require('bcrypt')
  const initializePassport = require('./passport-config')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const fs= require('fs')
  const port= process.env.PORT || 5000
  const router=express.router()

  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  

  const users = [
    [
      {
        id: '1639329964426',
        name: 'Rajesh Sharma',
        email: 'shukla.ritu@gmail.com',
        password: '$2b$10$cCm3N6BtaztMu2yE4MD3m.yxWM0vOP3gbBhnOsbFntPX9WIo8hjR2'
      }
    ]
  ]
  
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({extended:false}))
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(flash())
  app.use(passport.initialize())
  app.use(express.static(__dirname + '/public')); 
  app.use(passport.session())

  app.use(express.static('public'));
  app.get('/', (req, res) => {
    res.redirect("/login")
  })

  app.get('/login', (req, res) => {
    res.render('login.ejs')
  })
  app.get('/404error', (req, res) => {
    res.render('404error.ejs')
  })
  app.get('/403error', (req, res) => {
    res.render('403error.ejs')
  })
  app.get('/503error', (req, res) => {
    res.render('503error.ejs')
  })
  app.get('/games', (req, res) => {
    res.render('games.ejs')
  })
  app.get('/meme', (req, res) => {
    res.render('meme.ejs')
  })
  app.get('/menja', (req, res) => {
    res.render('menja.ejs')
  })
  app.get('/squidgame', (req, res) => {
    res.render('squidgame.ejs')
  })
  app.get('/tictactoe', (req, res) => {
    res.render('tictactoe.ejs')
  })
   app.get('/videos', (req, res) => {
    res.render('videos.ejs')
  })

  app.get('/home', (req, res) => {
    res.render("index.ejs",{name:'kyle'} )
  })

  app.post('/login',  passport.authenticate('local',{
    successRedirect: '/home',
    failureRedirect: '/login',
    failureflash: true
  }))
  app.get('/register',  (req, res) => {
    res.render('register.ejs')
  })
  app.post('/register',  async (req, res) => {
    try{
      const hashedPassword =await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
      })
    }catch{
      res.redirect('/register')
    }
    console.log(users)
  })
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  app.use("/.netlify/functions/api", router);
  

  app.listen(3000)