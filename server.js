const express = require('express')
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');
const register = require('./controllers/register.js');
const signIn = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const imageApi =  require('./controllers/image.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express()
app.use(cors())

const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const db= knex({
  client: 'pg',
  connection: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
        rejectUnauthorized: false,
    },
});

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get("/", (req, res)=>{
  res.send('App has been confirmed working')
})

app.post("/signin", signIn.handleSignIn(db, bcrypt));
app.post('/register', (req, res) =>register.handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res)=>profile.profileHandler(req, res, db));
app.put('/image', (req, res)=>imageApi.imageHandler(req, res, db));
app.post('/imageUrl', (req, res)=>imageApi.handleApiCall(req, res))

app.listen(process.env.PORT || 2000, ()=>console.log(`app is running on port ${process.env.PORT}`))