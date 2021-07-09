require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const session = require("express-session")

// connecting to database
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
.then(() => {
    console.log("database connected !");

})
.catch((err) => {
    console.log("error connecting to database", err)
})

app.set("view engine", "pug")
app.set("views" , "views")
app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'twitterclone123',
    resave: false,
    saveUninitialized: true
  }))

//  routes
const loginRoute = require('./routes/loginRoute')
const registerRoute = require('./routes/registerRoute')
const logoutRoute = require('./routes/logoutRoute')

// Api routes
const postRoute = require('./routes/api/post')

app.use("/login", loginRoute)
app.use("/register", registerRoute)
app.use("/logout", logoutRoute)

app.use("/api/posts", postRoute)

app.get("/",middleware.requireLogin, (req,res,next) => {
    res.status(200).render("home",{
        user:req.session.user,
        userJs:JSON.stringify(req.session.user),
        pageTitle:"Home"
    })
})


const server = app.listen(port, () => console.log(`listening on port ${port}`))