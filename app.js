const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const { create } = require("express-handlebars");
const csrf = require('csurf')
const User = require('./models/User')
const hbs = create({
    extname: ".hbs",
    partialsDir:['views/components']
});
const port = process.env.PORT || 8080

//Configuracion variables de entonrno y ruta de la base
require('dotenv').config()
const clientDB = require('./database/db')
const { cookie } = require('express-validator')

const app = express()

const corsOptions = {
    credential: true,
    origin: process.env.PATHCLEVER|| '*',
    methods: ['GET', 'POST']
}

app.use(cors())
//Configuracion del engine y ubicacion de las vistas
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views","./views");

app.set('trust proxy', 1)
//Middlewares
app.use(session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: 'superNombreSecretoPa',
    store: MongoStore.create({
        clientPromise: clientDB,
        dbName: process.env.DBNAME
    }),
    cookie: { secure: true, maxAge: 30 * 24 * 60 * 60 * 1000}
}))
app.use(flash())
app.use(mongoSanitize())


app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user,done)=>{
    return done(null, {id: user._id, userName: user.nombre}) 
})

passport.deserializeUser(async(user,done)=>{
    const userDB = await User.findById(user.id)
    return done(null, {id: userDB._id, userName: userDB.nombre})
})


app.use(express.urlencoded({extended : true}))
app.use(csrf())
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken()
    res.locals.mensaje = req.flash('mensaje')
    next()
})
app.use(express.static((__dirname + "/public")));
/* app.use(express.static((__dirname + "/public/img/perfil"))); */
app.use('/', require('./routes/home'))
app.use('/perfil', require('./routes/perfil'))
app.use('/auth', require('./routes/auth'))









app.listen(port, ()=>{
    console.log('Recibiendo en el puerto ', port)
})